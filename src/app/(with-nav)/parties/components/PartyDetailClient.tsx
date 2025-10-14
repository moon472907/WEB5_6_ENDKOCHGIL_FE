'use client';

import React, { useEffect, useRef, useState } from 'react';
import PartySetting from '@/app/partydetail/[id]/components/PartySetting';
import BaseModal from '@/components/modal/BaseModal';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { fetchPartyDetailClient } from '@/lib/api/parties/parties';
import { getMyInfo } from '@/lib/api/member';
import { useRouter } from 'next/navigation';

// STOMP v5
import { Client, IMessage, IFrame, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

type Member = {
  id?: number;
  name: string;
  subtitle?: string;
  title?: string;
  crowned?: boolean;
};

type ChatMessageDto = {
  id?: number; // 서버가 부여하는 메시지 ID
  senderEmail?: string; // 서버가 내려주는 발신자 식별자
  content?: string | null; // 삭제 이벤트면 null일 수 있음
  partyId: number;
};

export default function PartyDetailClient({ partyId }: { partyId: string }) {
  const router = useRouter();

  const [members, setMembers] = useState<Member[]>([]);
  const [messages, setMessages] = useState<ChatMessageDto[]>([]);
  const [text, setText] = useState('');
  const [currentUser, setCurrentUser] = useState<string>('');
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [leaderId, setLeaderId] = useState<number | null>(null); // 추가
  const [currentUserTitle, setCurrentUserTitle] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 새: 파티 기본 정보 (PartySetting 전달용)
  const [partyName, setPartyName] = useState<string>('');
  const [partyMaxMembers, setPartyMaxMembers] = useState<number>(4);
  const [partyIsPublic, setPartyIsPublic] = useState<boolean>(true);

  // 새: 설정 모달 열림 상태
  const [settingOpen, setSettingOpen] = useState(false);

  const messagesRef = useRef<HTMLDivElement | null>(null);

  // STOMP client reference (활성화된 Client를 보관)
  const stompRef = useRef<Client | null>(null);

  // 1) 파티 상세 + 멤버
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const detail = await fetchPartyDetailClient(partyId); // 가정된 함수명
        if (!mounted) return;

        // leaderId 저장 (숫자 타입으로)
        const parsedLeaderId = typeof detail.leaderId === 'number' ? detail.leaderId : Number(detail.leaderId);
        setLeaderId(Number.isFinite(parsedLeaderId) ? parsedLeaderId : null);

        setPartyName(String(detail.name ?? ''));
        setPartyMaxMembers(typeof detail.maxMembers === 'number' ? detail.maxMembers : 4);
        setPartyIsPublic(Boolean(detail.isPublic));

        // members 매핑
        const rawMembers = (detail.members ?? []) as Array<Record<string, unknown>>;
        const mapped: Member[] = rawMembers.map((m) => {
          const id = typeof m['id'] === 'number' ? (m['id'] as number) : Number(m['id']);
          const name = typeof m['name'] === 'string' ? (m['name'] as string) : `회원 ${id ?? ''}`;
          return {
            id,
            name,
            subtitle: typeof m['email'] === 'string' ? (m['email'] as string) : undefined,
            title: undefined,
            crowned: parsedLeaderId === id
          };
        });
        setMembers(mapped);
      } catch (err) {
        console.error(err);
        setError('파티 상세 정보를 불러오는 데 실패했습니다.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [partyId]);

  // 2) 내 정보(이름/이메일/아이디) — currentUserId 설정
  useEffect(() => {
    (async () => {
      try {
        const me = await getMyInfo(undefined);
        setCurrentUser(me?.name ?? me?.email ?? '');
        setCurrentUserId(typeof me?.id === 'number' ? me.id : null);
        setCurrentUserTitle(me?.title ?? null); // 장착된 칭호
      } catch (err) {
        console.error('[ERROR] 내 정보 조회 실패:', err);
      }
    })();
  }, []);

  // leaderId / currentUserId 확인
  useEffect(() => {
    console.log('leaderId, currentUserId =>', leaderId, currentUserId);
  }, [leaderId, currentUserId]);

  // 3) 기존 채팅 히스토리 (HTTP)
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetch(
          `/api/v1/parties/${partyId}/chat/history?page=0&size=30`,
          {
            credentials: 'include' // 쿠키 인증 사용 시
          }
        );
        const data = await res.json();
        if (Array.isArray(data?.content)) {
          // 최신이 먼저라면 UI에서 뒤집을지, 그대로 둘지 정책 선택
          setMessages(data.content.reverse()); // 오래된 → 최신 순으로 보이게
        }
      } catch (e) {
        console.error('Error fetching chat history:', e);
      }
    };
    loadHistory();
  }, [partyId]);

  // 4) STOMP 연결 및 구독
  useEffect(() => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!API_BASE_URL) {
      console.error('NEXT_PUBLIC_API_BASE_URL 환경변수가 정의되지 않았습니다.');
      return;
    }

    const base = API_BASE_URL.replace(/\/$/, '');
    const sockEndpoint = `${base}/ws/chat`;

    let subscription: StompSubscription | null = null;
    const client = new Client({
      webSocketFactory: () => new SockJS(sockEndpoint),
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug:
        process.env.NEXT_PUBLIC_NODE_ENV !== 'production'
          ? (msg: string) => console.log('[STOMP]', msg)
          : undefined,
      onConnect: () => {
        console.log('STOMP 연결 성공:', sockEndpoint);
        subscription = client.subscribe(
          `/topic/party/${partyId}`,
          (message: IMessage) => {
            try {
              const payload: ChatMessageDto = JSON.parse(message.body);
              setMessages(prev => [...prev, payload]);
              setTimeout(() => {
                messagesRef.current?.scrollTo({
                  top: messagesRef.current.scrollHeight,
                  behavior: 'smooth'
                });
              }, 30);
            } catch (err) {
              console.error('Invalid STOMP message payload', err);
            }
          }
        );
      },
      onStompError: (frame: IFrame) => {
        console.error('STOMP error:', frame.headers?.['message'], frame.body);
      },
      onWebSocketClose: (evt: CloseEvent) => {
        console.warn('WebSocket closed:', evt.reason || evt.code);
      }
    });

    client.activate();
    stompRef.current = client;

    return () => {
      try {
        if (subscription) subscription.unsubscribe();
      } catch {
        // ignore
      }
      client.deactivate();
      stompRef.current = null;
    };
  }, [partyId]);

  const handleSend = () => {
    const body = text.trim();
    if (!body || !stompRef.current || !stompRef.current.connected) return; // 연결 체크

    // 서버가 기대하는 DTO 필드명에 맞춰 전송
    const dto: ChatMessageDto = {
      partyId: Number(partyId),
      content: body
    };

    // 서버의 @MessageMapping("/chat.sendMessage")와 매칭
    stompRef.current.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify(dto)
    });

    // 서버 브로드캐스트와 중복 표시 방지
    setMessages(prev => [
      ...prev,
      { ...dto, senderEmail: currentUser || 'me@local' }
    ]);

    setText('');
    setTimeout(() => {
      messagesRef.current?.scrollTo({
        top: messagesRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }, 30);
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      {/* 멤버 그리드 */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {members.map(m => (
          <div
            key={m.id ?? m.name}
            className="relative rounded-lg bg-basic-white p-3 flex flex-col items-center text-center shadow-sm"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center mb-2">
              <span className="text-base font-semibold text-gray-08">
                {m.name && m.name.length > 0 ? m.name.charAt(0) : '?'}
                <br />
                (이미지)
              </span>
            </div>
            <div className="text-xs text-gray-05">
              {/*
                우선순위:
                1) 멤버 객체의 title (문자열)
                2) 멤버.id === currentUserId 이면 currentUserTitle
                3) 없으면 '칭호 없음'
              */}
              {m.title
                ? m.title
                : m.id && currentUserId && m.id === currentUserId
                ? currentUserTitle ?? '칭호 없음'
                : '칭호 없음'}
            </div>
            <div className="text-sm text-gray-10 font-medium">{m.name}</div>
            {m.crowned && (
              <div className="absolute left-2 top-2">
                <Image src="/crown.svg" alt="왕관" width={28} height={28} />
              </div>
            )}
          </div>
        ))}
        <div className="rounded-lg bg-basic-white p-3 flex items-center justify-center text-2xl text-gray-300">
          <Image src="/not.svg" alt="빈 슬롯" width={80} height={80} />
        </div>
      </div>

      {/* 파티 계획 버튼 */}
      <div className="mb-4">
        <Button
          variant="basic"
          size="md"
          fullWidth
          onClick={() =>
            router.push(`/partyplan?partyId=${encodeURIComponent(partyId)}`)
          }
        >
          파티 계획
        </Button>
      </div>

      {/* 파티 설정 버튼 (모달로 열기) */}
      <div className="mb-4">
        <Button
          variant="basic"
          size="md"
          fullWidth
          onClick={() => setSettingOpen(true)}
        >
          파티 설정
        </Button>
      </div>

      {/* 설정 모달: PartySetting을 modal 내부에 렌더링 */}
      <BaseModal isOpen={settingOpen} onClose={() => setSettingOpen(false)}>
        <PartySetting
          partyId={partyId}
          initialName={partyName}
          initialMaxMembers={partyMaxMembers}
          initialIsPublic={partyIsPublic}
          // 리더 여부 전달: 숫자 비교로 정확히 체크
          isLeader={currentUserId !== null && leaderId !== null && currentUserId === leaderId}
        />
      </BaseModal>

      {/* 채팅 박스 */}
      <div className="rounded-xl bg-basic-white p-3">
        <div
          ref={messagesRef}
          className="h-40 overflow-auto p-2 space-y-2 scrollbar scrollbar-thin scrollbar-thumb-orange-nuts scrollbar-track-[rgba(0,0,0,0.04)]"
        >
          {messages.map((m, i) => {
            const isMine =
              !!currentUser &&
              (m.senderEmail?.toLowerCase() === currentUser.toLowerCase() ||
                m.senderEmail === 'me@local'); // 낙관 업데이트 구분용

            // 삭제 이벤트(content=null) 시 표시 정책
            if (m.content === null) {
              return (
                <div
                  key={m.id ?? `del-${i}`}
                  className="text-xs text-gray-500 italic"
                >
                  메시지(ID: {m.id ?? 'unknown'})가 삭제되었습니다.
                </div>
              );
            }

            return (
              <div key={m.id ?? i} className="text-sm">
                <span
                  className={`font-medium ${
                    isMine ? 'text-[#E98E3E]' : 'text-gray-700'
                  }`}
                >
                  {isMine ? '나' : m.senderEmail ?? '알 수 없음'} :{' '}
                </span>
                <span className={isMine ? 'text-[#E98E3E]' : 'text-gray-700'}>
                  {m.content}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 입력창 */}
      <div className="mt-3">
        <div className="relative rounded-xl bg-basic-white focus-within:ring-2 focus-within:ring-orange-nuts">
          <div className="flex items-center gap-2 px-3 py-2">
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="채팅을 입력해 주세요"
              className="flex-1 bg-transparent outline-none"
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              maxLength={1000} // 서버 @Size(max=1000)와 맞춤
            />
            <button
              onClick={handleSend}
              className="text-orange-nuts font-semibold"
              disabled={
                !stompRef.current ||
                !stompRef.current.connected ||
                text.trim() === ''
              }
            ></button>
          </div>
        </div>
      </div>
    </div>
  );
}
