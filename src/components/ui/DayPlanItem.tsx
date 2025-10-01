'use client';

import { useState, useRef, useEffect } from 'react';
import { MdCheck, MdEdit } from 'react-icons/md';

type Variant = 'past' | 'current' | 'next';

interface Props {
  day: number;
  title: string;
  variant: Variant;
  onSave?: (nextTitle: string) => void; // 추가: 부모에 저장 요청
}

export default function DayPlanItem({ day, title, variant, onSave }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(title);

  // input DOM 참조
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSave = () => {
    setIsEditing(false);
    if (value !== title) onSave?.(value); // 부모로 변경 전달
  };

  // editing 시작되면 input에 포커스 주기
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const baseStyle =
    'flex items-center justify-between bg-bg-card-default text-base text-button-point font-semibold rounded-xl px-5 py-3';
  const variantStyle = {
    past: 'bg-bg-disabled text-gray-07', // 지난 날
    current: '', // 현재 주차
    next: '' // 다음 주차
  }[variant];

  return (
    <li className={`${baseStyle} ${variantStyle}`}>
      <span className="mr-2 shrink-0">{day}일차 :</span>

      <div className="flex-1 mr-2">
        {isEditing ? (
          <input
            ref={inputRef} // ref 연결
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSave();
              }
            }}
            className="px-2 w-full bg-transparent outline-1 outline-button-point rounded-lg font-semibold text-base text-button-point h-full"
          />
        ) : (
          <span className="block w-full">{value}</span>
        )}
      </div>

      {variant === 'next' && (
        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className="text-button-point cursor-pointer"
        >
          {isEditing ? <MdCheck /> : <MdEdit />}
        </button>
      )}
    </li>
  );
}
