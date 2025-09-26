'use client';

import React from 'react';

interface BirthInputProps {
  value: { year: string; month: string; day: string };
  onChange: (val: { year: string; month: string; day: string }) => void;
}

export default function BirthInput({ value, onChange }: BirthInputProps) {
  return (
    <div className="flex justify-between gap-2 w-full">
      {/* 연도 */}
      <input
        type="text"
        inputMode="numeric"
        maxLength={4}
        value={value.year}
        onChange={e =>
          onChange({
            ...value,
            year: e.target.value.replace(/[^0-9]/g, ''),
          })
        }
        placeholder="0000년"
        className="w-1/3 border-b border-button-selected text-center focus:outline-none focus:placeholder-transparent"
      />

      {/* 월 */}
      <input
        type="text"
        inputMode="numeric"
        maxLength={2}
        value={value.month}
        onChange={e =>
          onChange({
            ...value,
            month: e.target.value.replace(/[^0-9]/g, ''),
          })
        }
        onBlur={e => {
          if (e.target.value && e.target.value.length === 1) {
            onChange({ ...value, month: `0${e.target.value}` });
          }
        }}
        placeholder="00월"
        className="w-1/3 border-b border-button-selected text-center focus:outline-none focus:placeholder-transparent"
      />

      {/* 일 */}
      <input
        type="text"
        inputMode="numeric"
        maxLength={2}
        value={value.day}
        onChange={e =>
          onChange({
            ...value,
            day: e.target.value.replace(/[^0-9]/g, ''),
          })
        }
        onBlur={e => {
          if (e.target.value && e.target.value.length === 1) {
            onChange({ ...value, day: `0${e.target.value}` });
          }
        }}
        placeholder="00일"
        className="w-1/3 border-b border-button-selected text-center focus:outline-none focus:placeholder-transparent"
      />
    </div>
  );
}
