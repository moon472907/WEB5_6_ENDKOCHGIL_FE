'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BASE_URL } from '@/lib/api/config';

type MemberLite = {
  id?: number;
  name: string;
  subtitle?: string; // email
  title?: string | null;
};

type ChatMessage = {
  id?: number; // null 제거: 파싱 시 null은 undefined로 흡수
  partyId: number;
  content: string;
  senderEmail?: string;
  senderId?: number;
  senderName?: string;
  temp?: boolean; // optimistic flag
};

type Props = {
  partyId: string;
  currentUserId: number | null;
  currentUserEmail: string | null;
  currentUserName: string;
  initialMembers: MemberLite[];
};

const toNumber = (v: unknown): number | undefined =>
  typeof v === 'number'
    ? v
    : typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v))
    ? Number(v)
    : undefined;

export default function PartyChat({
  partyId,
  currentUserEmail,
  currentUserId,
  currentUserName,
  initialMembers,
}: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const stompRef = useRef<Client | null>(null);
  const storageKey = useMemo(() => `partyChat:${partyId}:atBottom`, [partyId]);

  const myEmail = useMemo(
    () => (currentUserEmail && currentUserEmail.trim() !== '' ? currentUserEmail : undefined),
    [currentUserEmail]
  );

  const isDev = process.env.NODE_ENV !== 'production';

  // 하단 여부 측정
  const isAtBottom = useCallback((): boolean => {
    const el = messagesRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight <= 20;
  }, []);

  // 스크롤 이벤트 → 하단 여부를 sessionStorage에 저장
  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;
    const onScroll = () => {
      try {
        sessionStorage.setItem(storageKey, isAtBottom() ? '1' : '0');
      } catch {
        /* ignore */
      }
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    // 초기값 기록
    onScroll();
    return () => el.removeEventListener('scroll', onScroll);
  }, [isAtBottom, storageKey]);

  // 히스토리 로드(엔드포인트는 필요 시 조정)
  useEffect(() => {
    let abort = false;
    (async () => {
      try {
        const base = BASE_URL?.replace(/\/$/, '');
        if (!base) {
          console.error('BASE_URL이 설정되지 않았습니다. config.ts/.env를 확인하세요.');
          return;
        }
        const url = `${base}/api/v1/parties/${encodeURIComponent(partyId)}/chat/history?page=0&size=30`;
        const res = await fetch(url, {
          credentials: 'include',
          headers: { Accept: 'application/json' },
        });
        const json = await res.json().catch(() => null);

        const list: unknown[] = Array.isArray(json)
          ? json
          : json && typeof json === 'object' && Array.isArray((json as Record<string, unknown>).content)
          ? ((json as Record<string, unknown>).content as unknown[])
          : [];

        const normalized: ChatMessage[] = list
          .map((u) => {
            if (!u || typeof u !== 'object') return null;
            const r = u as Record<string, unknown>;
            const item: ChatMessage = {
              id: toNumber(r.id),
              partyId: toNumber(r.partyId) ?? Number(partyId),
              content: r.content != null ? String(r.content) : '',
              senderEmail: typeof r.senderEmail === 'string' ? r.senderEmail : undefined,
              senderId: toNumber(r.senderId),
              senderName: typeof r.senderName === 'string' ? r.senderName : undefined,
            };
            return item;
          })
          .filter((v): v is ChatMessage => v !== null);

        if (!abort) {
          setMessages(normalized.slice().reverse());
          // 하단 복원
          try {
            if (sessionStorage.getItem(storageKey) === '1') {
              setTimeout(() => {
                messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: 'auto' });
              }, 30);
            }
          } catch {
            /* ignore */
          }
        }
      } catch (e) {
        if (isDev) console.warn('채팅 히스토리 로드 실패', e);
      }
    })();
    return () => {
      abort = true;
    };
  }, [partyId, storageKey, isDev]);

  // messages가 바뀌면, 사용자가 하단 유지 중이면 자동 스크롤
  useEffect(() => {
    try {
      if (sessionStorage.getItem(storageKey) === '1') {
        setTimeout(() => {
          messagesRef.current?.scrollTo({
            top: messagesRef.current.scrollHeight,
            behavior: 'smooth',
          });
        }, 30);
      }
    } catch {
      /* ignore */
    }
  }, [messages, storageKey]);

  // 수신 메시지 파서
  const parseIncoming = useCallback(
    (message: IMessage): ChatMessage | null => {
      try {
        const raw = JSON.parse(message.body) as unknown;
        if (!raw || typeof raw !== 'object') return null;
        const r = raw as Record<string, unknown>;
        const out: ChatMessage = {
          id: toNumber(r.id),
          partyId: toNumber(r.partyId) ?? Number(partyId),
          content: r.content != null ? String(r.content) : '',
          senderEmail: typeof r.senderEmail === 'string' ? r.senderEmail : undefined,
          senderId: toNumber(r.senderId),
          senderName: typeof r.senderName === 'string' ? r.senderName : undefined,
        };
        return out;
      } catch (e) {
        if (isDev) console.error('Invalid STOMP payload', e);
        return null;
      }
    },
    [partyId, isDev]
  );

  // STOMP 연결
  useEffect(() => {
    const base = BASE_URL;
    if (!base) {
      console.error('BASE_URL이 설정되지 않았습니다.');
      return;
    }
    const endpoint = `${base.replace(/\/$/, '')}/ws/chat`;
    let sub: StompSubscription | null = null;

    const client = new Client({
      webSocketFactory: () => new SockJS(endpoint),
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: isDev ? (msg) => console.log('[STOMP]', msg) : undefined,
      onConnect: () => {
        sub = client.subscribe(`/topic/party/${partyId}`, (msg) => {
          const incoming = parseIncoming(msg);
          if (!incoming) return;

          if (isDev) console.log('WS payload:', incoming);

          // 중복 방지 및 낙관치 교체
          setMessages((prev) => {
            // 동일 id 존재 → 무시
            if (incoming.id != null && prev.some((m) => m.id === incoming.id)) return prev;

            // 임시(낙관치)와 매칭하여 교체
            const idx = prev.findIndex(
              (m) =>
                (m.id == null || m.temp) &&
                (m.content ?? '') === (incoming.content ?? '') &&
                ((m.senderEmail && incoming.senderEmail && m.senderEmail === incoming.senderEmail) ||
                  (m.senderId != null &&
                    incoming.senderId != null &&
                    m.senderId === incoming.senderId))
            );
            if (idx !== -1) {
              const copy = prev.slice();
              copy[idx] = { ...incoming, temp: false };
              return copy;
            }

            return [...prev, { ...incoming, temp: false }];
          });

          // 하단 고정
          setTimeout(() => {
            messagesRef.current?.scrollTo({
              top: messagesRef.current.scrollHeight,
              behavior: 'smooth',
            });
            try {
              sessionStorage.setItem(storageKey, '1');
            } catch {
              /* ignore */
            }
          }, 30);
        });
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame?.headers?.['message'], frame?.body);
      },
      onWebSocketClose: (evt) => {
        if (isDev) console.warn('WebSocket closed:', evt.reason || evt.code);
      },
    });

    client.activate();
    stompRef.current = client;

    return () => {
      try {
        if (sub) sub.unsubscribe();
      } catch {
        /* ignore */
      }
      client.deactivate();
      stompRef.current = null;
    };
  }, [partyId, parseIncoming, isDev, storageKey]);

  // 전송
  const handleSend = useCallback(() => {
    const body = text.trim();
    if (!body) return;
    const client = stompRef.current;
    if (!client || !client.connected) return;

    const dto: ChatMessage = {
      partyId: Number(partyId),
      content: body,
      senderEmail: myEmail ?? 'me@local',
      senderId: currentUserId ?? undefined,
      senderName: currentUserName ?? undefined,
      temp: true,
    };

    try {
      client.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify({
          partyId: dto.partyId,
          content: dto.content,
          senderEmail: dto.senderEmail,
          senderId: dto.senderId,
          senderName: dto.senderName,
        }),
      });
    } catch (e) {
      console.error('stomp publish failed', e);
    }

    // 낙관적 추가
    setMessages((prev) => [...prev, dto]);
    setText('');
    setTimeout(() => {
      messagesRef.current?.scrollTo({
        top: messagesRef.current.scrollHeight,
        behavior: 'smooth',
      });
      try {
        sessionStorage.setItem(storageKey, '1');
      } catch {
        /* ignore */
      }
    }, 30);
  }, [text, partyId, myEmail, currentUserId, currentUserName, storageKey]);

  const displayName = useCallback(
    (m: ChatMessage): string => {
      // 1) senderId 기준으로 멤버 이름 찾기
      if (m.senderId != null) {
        const byId = initialMembers.find(mm => mm.id === m.senderId);
        if (byId?.name) return byId.name;
      }
      // 2) senderEmail 기준으로 멤버 이름 찾기 (subtitle = email)
      if (m.senderEmail) {
        const byEmail = initialMembers.find(mm => mm.subtitle === m.senderEmail);
        if (byEmail?.name) return byEmail.name;
      }
      // 3) 서버가 보낸 senderName 사용
      if (m.senderName && m.senderName.trim() !== '') return m.senderName;
      // 4) 기본값
      return '사용자';
    },
    [initialMembers]
  );

  const mine = useCallback(
    (m: ChatMessage): boolean => {
      if (myEmail && m.senderEmail) return myEmail === m.senderEmail;
      if (currentUserId != null && m.senderId != null) return currentUserId === m.senderId;
      return false;
    },
    [myEmail, currentUserId]
  );

  return (
    <>
      {/* 채팅 박스 */}
      <div className="rounded-xl bg-basic-white p-3">
        <div
          ref={messagesRef}
          className="h-40 overflow-auto p-2 space-y-2 scrollbar scrollbar-thin scrollbar-thumb-orange-nuts scrollbar-track-[rgba(0,0,0,0.04)]"
        >
          {messages.map((m, idx) => {
            const isMine = mine(m);
            return (
              <div key={m.id ?? `tmp-${idx}`} className="text-sm">
                <span
                  className={`font-medium ${
                    isMine ? 'text-[#E98E3E]' : 'text-gray-700'
                  }`}
                >
                  {isMine ? '나' : displayName(m)} :{' '}
                </span>
                <span className={isMine ? 'text-[#E98E3E]' : 'text-gray-700'}>
                  {m.content}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-3">
        <div className="relative rounded-xl bg-basic-white focus-within:ring-2 focus-within:ring-orange-nuts">
          <div className="flex items-center gap-2 px-3 py-2">
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="채팅을 입력해 주세요"
              className="flex-1 bg-transparent outline-none"
              onKeyDown={e => {
                if (e.key === 'Enter') handleSend();
              }}
            />
            <button onClick={handleSend} > </button>
          </div>
        </div>
      </div>
    </>
  );
}
