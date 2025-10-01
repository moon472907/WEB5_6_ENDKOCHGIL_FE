'use client';

import React, { useEffect, useRef, useState } from 'react';
import Button from '@/components/ui/Button';
import Image from 'next/image';

type Member = {
  id: number;
  name: string;
  subtitle?: string;
  crowned?: boolean;
};

export default function PartyDetailClient({ partyId }: { partyId: string }) {
  const [members] = useState<Member[]>([
    { id: 1, name: '이성균', subtitle: '무작위 총력전의 신', crowned: true },
    { id: 2, name: '김태은', subtitle: '무작위 총력전의 신' },
    { id: 3, name: '성창식', subtitle: '일반겜 신' },
    { id: 4, name: '범쌤', subtitle: '그냥' }
  ]);
  const [messages, setMessages] = useState([
    { id: 'm1', author: '성창식', text: '안녕하세요 \\(^o^)/' },
    { id: 'm2', author: '김태은', text: '안녕못해요' },
    { id: 'm3', author: '이성균', text: '메이플 하고싶다' },
    { id: 'm4', author: '이성균', text: '칼바람 하고싶다' },
    { id: 'm5', author: '박철현', text: '핑크빈 귀여워' }
  ]);
  const [text, setText] = useState('');
  const messagesRef = useRef<HTMLDivElement | null>(null);

  const currentUser = '성창식';

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight });
  }, []);

  const handleSend = () => {
    if (!text.trim()) return;
    setMessages(s => [
      ...s,
      { id: String(Date.now()), author: currentUser, text: text.trim() }
    ]);
    setText('');
    setTimeout(
      () =>
        messagesRef.current?.scrollTo({
          top: messagesRef.current.scrollHeight
        }),
      50
    );
  };

  return (
    <div>
      {/* 멤버 그리드 */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {members.map(m => (
          <div
            key={m.id}
            className="relative rounded-lg bg-basic-white p-3 flex flex-col items-center shadow-sm"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center mb-2">
              <span className="text-base font-semibold text-gray-08">
                {m.name.charAt(0)}<br />(이미지)
              </span>
            </div>
            <div className="text-xs text-gray-05">{m.subtitle}</div>
            <div className="text-sm text-gray-10 font-medium">{m.name}</div>
            {m.crowned && (
              <div className="absolute left-2 top-2">
                <Image src="/crown.svg" alt="왕관" width={28} height={28} />
              </div>
            )}
          </div>
        ))}
        {/* 빈 슬롯 */}
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
          onClick={() => alert('파티 계획 클릭')}
        >
          파티 계획
        </Button>
      </div>

      {/* 채팅 박스 */}
      <div className="rounded-lg bg-basic-white p-3">
        <div
          ref={messagesRef}
          className="h-40 overflow-auto p-2 space-y-2 scrollbar scrollbar-thin scrollbar-thumb-orange-nuts scrollbar-track-[rgba(0,0,0,0.04)]"
        >
          {messages.map(m => {
            const isMine = m.author === currentUser;
            return (
              <div key={m.id} className="text-sm">
                <span
                  className={`font-medium ${
                    isMine ? 'text-[#E98E3E]' : 'text-gray-700'
                  }`}
                >
                  {isMine ? '나' : m.author} :{' '}
                </span>
                <span className={isMine ? 'text-[#E98E3E]' : 'text-gray-700'}>
                  {m.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-3">
        <div className="relative rounded-2xl bg-basic-white focus-within:ring-2 focus-within:ring-orange-nuts">
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
            <button
              className="ml-2 px-4 py-2 rounded-md bg-brown-600 text-white"
              onClick={handleSend}
            >
              전송
            </button>
          </div>
        </div>
      </div>

      {/* 하단 알림 배너*/}
    </div>
  );
}
