'use client';

import Toggle from '@/components/ui/Toggle';
import { useState } from 'react';

export default function Page() {
  const [checked, setChecked] = useState(false); // 토글 상태 관리

  return (
    <>
      <div className="bg-tag-care text-3xl">test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test</div>
      <div className="bg-tag-care text-3xl">test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test</div>
      <div className="bg-tag-care text-3xl">test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test</div>
      <div className="bg-tag-care text-3xl">test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test</div>
      <div className="bg-tag-care text-3xl">test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test</div>
      <div className="bg-tag-care text-3xl">test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test</div>
      <div className="bg-tag-care text-3xl">test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test</div>
      <div className="bg-tag-care text-3xl">test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test</div>
      <div className="bg-tag-care text-3xl">test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test</div>
      <div className="bg-tag-care text-3xl">test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test</div>
      <div className="bg-tag-care text-3xl">test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test</div>
      <Toggle
        checked={checked}
        onChange={setChecked}
        leftLabel="전체 보기"
        rightLabel="전체 안 보기"
      />
    </>
  );
}
