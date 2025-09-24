'use client';

import ContentWrapper from '@/components/layout/ContentWrapper';
import Header from '@/components/layout/Header';
import ConfirmModal from '@/components/modal/ConfirmModal';
import Toggle from '@/components/ui/Toggle';
import { useState } from 'react';

export default function Page() {
  const [checked, setChecked] = useState(false); // 토글 상태 관리
  const [open, setOpen] = useState(false); // 모달 열림 상태

  // 확인 버튼 눌렀을 때 동작
  const handleConfirm = () => {
    console.log('확인 버튼 눌림');
    setOpen(false);
  };

  // 취소 버튼 눌렀을 때 동작
  const handleCancel = () => {
    console.log('취소 버튼 눌림');
    setOpen(false);
  };

  return (
    <>
      <Header title="테스트입니다" />
      <ContentWrapper withNav>
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

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
        >
          모달 열기
        </button>

        <ConfirmModal
          open={open}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          variant="happy"
          lines={['파티에 참여 하시겠습니까?']}
        />
      </ContentWrapper>
    </>
  );
}
