'use client';

import Toggle from '@/components/ui/Toggle';
import { useState } from 'react';

export default function Page() {
  const [checked, setChecked] = useState(false); // 토글 상태 관리

  return (
    <>
      <div className="bg-tag-care text-8xl leading-normal">가나다라마바사 아자차카파타하</div>
      <div className="bg-tag-care text-8xl leading-normal">가나다라마바사 아자차카파타하</div>
      <div className="bg-tag-care text-8xl leading-normal">가나다라마바사 아자차카파타하</div>
      <div className="bg-tag-care text-8xl leading-normal">가나다라마바사 아자차카파타하</div>
      <div className="bg-tag-care text-8xl leading-normal">가나다라마바사 아자차카파타하</div>
      <Toggle checked={checked} onChange={setChecked} leftLabel='전체 보기' rightLabel='전체 안 보기' />
    </>
  );
}
