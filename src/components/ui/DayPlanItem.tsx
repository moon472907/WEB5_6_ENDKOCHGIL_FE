'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MdCheck, MdEdit } from 'react-icons/md';

type Variant = 'past' | 'current' | 'next';

interface DayPlanItemProps {
  day: number;
  title: string;
  variant: Variant;
  taskId: number;
  subGoalId: number;
  onSave?: (nextTitle: string, taskId: number, subGoalId: number) => void;
}

export default function DayPlanItem({
  day,
  title,
  variant,
  taskId,
  subGoalId,
  onSave
}: DayPlanItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(title);

  // input DOM 참조
  const inputRef = useRef<HTMLInputElement | null>(null);
  const wrapperRef = useRef<HTMLLIElement | null>(null);

  const handleSave = () => {
    setIsEditing(false);
    if (value !== title) onSave?.(value, taskId, subGoalId);
  };

  const handleCancel = useCallback(() => {
    setValue(title); // 원래 제목으로 복구
    setIsEditing(false);
  }, [title]); // title이 바뀔 때만 새로 정의됨

  // editing 시작되면 input에 포커스 주기
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  // 외부 클릭 시 자동 취소
  useEffect(() => {
    if (!isEditing) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        handleCancel();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing, handleCancel]);

  const baseStyle =
    'flex items-center justify-between bg-bg-card-default text-base text-button-point font-semibold rounded-xl px-5 py-3';
  const variantStyle = {
    past: 'bg-bg-disabled text-gray-07', // 지난 날
    current: '', // 현재 주차
    next: '' // 다음 주차
  }[variant];

  return (
    <li ref={wrapperRef} className={`${baseStyle} ${variantStyle}`}>
      <span className="mr-2 shrink-0">{day}일차 :</span>

      <div className="flex-1 mr-2">
        {isEditing ? (
          <input
            ref={inputRef}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSave();
              } else if (e.key === 'Escape') {
                e.preventDefault();
                handleCancel();
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
          type="button"
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className="text-button-point cursor-pointer"
        >
          {isEditing ? <MdCheck /> : <MdEdit />}
        </button>
      )}
    </li>
  );
}
