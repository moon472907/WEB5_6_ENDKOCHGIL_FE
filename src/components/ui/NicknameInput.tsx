'use client';

import React from 'react';

interface NicknameInputProps {
  value: string;
  onChange: (val: string) => void;
}

export default function NicknameInput({ value, onChange }: NicknameInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="닉네임을 입력해 주세요"
      className="w-full border-b border-button-selected px-1 py-2 focus:outline-none focus:placeholder-transparent"
    />
  );
}
