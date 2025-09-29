'use client';

import { useState } from 'react';

export default function Page() {
  const [goal, setGoal] = useState('');
  const [maxPeople, setMaxPeople] = useState(1);
  const [period, setPeriod] = useState('1주일');
  const [isPublic, setIsPublic] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log({
      goal,
      maxPeople,
      period,
      isPublic
    });
    // TODO: API 연동
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 bg-[#F6F2ED] p-4 rounded-md text-[var(--color-basic-black)]"
    >
      {/* 목표 설정 */}
      <div>
        <label className="text-sm font-medium flex items-center gap-1 mb-1">
          🎯 목표 설정
        </label>
        <input
          type="text"
          value={goal}
          onChange={e => setGoal(e.target.value)}
          placeholder="토익 800점 목표로 공부하기"
          className="w-full rounded-md border px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-button-point)]"
        />
      </div>

      {/* 최대 참여 인원 */}
      <div>
        <label className="text-sm font-medium flex items-center gap-1 mb-1">
          👥 최대 참여 인원
        </label>
        <input
          type="number"
          min={1}
          value={maxPeople}
          onChange={e => setMaxPeople(Number(e.target.value))}
          className="w-full rounded-md border px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-button-point)]"
        />
        <p className="text-xs text-gray-500 mt-1">
          기간은 1주일 단위로 설정할 수 있습니다
        </p>
      </div>

      {/* 기간 */}
      <div>
        <label className="text-sm font-medium flex items-center gap-1 mb-1">
          ⏳ 기간
        </label>
        <select
          value={period}
          onChange={e => setPeriod(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-button-point)]"
        >
          <option value="1주일">1주일</option>
          <option value="2주일">2주일</option>
          <option value="3주일">3주일</option>
          <option value="4주일">4주일</option>
        </select>
      </div>

      {/* 공개 여부 */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium flex items-center gap-1">
            🔒 공개 여부
          </label>
          <p className="text-xs text-gray-500 mt-0.5">
            비공개 설정시 파티 모집에 등록되지 않습니다
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsPublic(prev => !prev)}
          className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
            isPublic ? 'bg-orange-500' : 'bg-gray-300'
          }`}
        >
          <span
            className={`h-4 w-4 bg-white rounded-full shadow-md transform transition-transform ${
              isPublic ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* 버튼 */}
      <button
        type="submit"
        className="mt-2 w-full rounded-md bg-[#6B574C] text-white py-2 font-medium shadow"
      >
        미션 생성
      </button>
    </form>
  );
}
