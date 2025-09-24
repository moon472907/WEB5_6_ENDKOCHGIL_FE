'use client';

import ContentWrapper from '@/components/layout/ContentWrapper';
import Header from '@/components/layout/Header';
import Toggle from '@/components/ui/Toggle';
import { useState } from 'react';

export default function Page() {
  const [checked, setChecked] = useState(false); // 토글 상태 관리

  return (
    <>
      <Header title="테스트입니다2" />
      <ContentWrapper>
        <div>
          <div className="bg-tag-care text-3xl">
            test test test test test test test test test test test test test
            test test test test test test test test test test test test test
            test test test test
          </div>
          <div className="bg-tag-care text-3xl">
            test test test test test test test test test test test test test
            test test test test test test test test test test test test test
            test test test test
          </div>
          <div className="bg-tag-care text-3xl">
            test test test test test test test test test test test test test
            test test test test test test test test test test test test test
            test test test test
          </div>
          <div className="bg-tag-care text-3xl">
            test test test test test test test test test test test test test
            test test test test test test test test test test test test test
            test test test test
          </div>
          <div className="bg-tag-care text-3xl">
            test test test test test test test test test test test test test
            test test test test test test test test test test test test test
            test test test test
          </div>
          <div className="bg-tag-care text-3xl">
            test test test test test test test test test test test test test
            test test test test test test test test test test test test test
            test test test test
          </div>
          <div className="bg-tag-care text-3xl">
            test test test test test test test test test test test test test
            test test test test test test test test test test test test test
            test test test test
          </div>
          <div className="bg-tag-care text-3xl">
            test test test test test test test test test test test test test
            test test test test test test test test test test test test test
            test test test test
          </div>
          <div className="bg-tag-care text-3xl">
            test test test test test test test test test test test test test
            test test test test test test test test test test test test test
            test test test test
          </div>
          <div className="bg-tag-care text-3xl">
            test test test test test test test test test test test test test
            test test test test test test test test test test test test test
            test test test test
          </div>
          <div className="bg-tag-care text-3xl">
            test test test test test test test test test test test test test
            test test test test test test test test test test test test test
            test test test test
          </div>
        </div>
        <Toggle
          checked={checked}
          onChange={setChecked}
          leftLabel="전체 보기"
          rightLabel="전체 안 보기"
        />
      </ContentWrapper>
    </>
  );
}
