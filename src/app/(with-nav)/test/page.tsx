'use client';

import ContentWrapper from '@/components/layout/ContentWrapper';
import Header from '@/components/layout/Header';
import AlertModal from '@/components/modal/AlertModal';
import ConfirmModal from '@/components/modal/ConfirmModal';
import NoticeToggleCard from '@/components/ui/NoticeToggleCard';
import PlanToggleCard from '@/components/ui/PlanToggleCard';
import ScrollButtonGroup from '@/components/ui/ScrollButtonGroup';
import Toggle from '@/components/ui/Toggle';
import { useState } from 'react';

export default function Page() {
  const [checked, setChecked] = useState(false); // 토글 상태 관리
  const [confirmOpen, setConfirmOpen] = useState(false); // ConfirmModal 열림 상태
  const [alertOpen, setAlertOpen] = useState(false); // AlertModal 열림 상태

  // 컨펌 확인 버튼 눌렀을 때 동작
  const handleConfirm = () => {
    console.log('확인 버튼 눌림');
    setConfirmOpen(false);
  };

  // 취소 버튼 눌렀을 때 동작
  const handleCancel = () => {
    console.log('취소 버튼 눌림');
    setConfirmOpen(false);
  };

  // 얼럿 확인 버튼 눌렀을 때 동작
  const handleAlert = () => {
    console.log('확인 버튼 눌림');
    setAlertOpen(false);
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
          onClick={() => setConfirmOpen(true)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
        >
          컨펌 모달 열기
        </button>

        <button
          type="button"
          onClick={() => setAlertOpen(true)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
        >
          얼럿 모달 열기
        </button>

        <PlanToggleCard title="단계별 계획 1주차">
          <div>1일차 : 단어 10개 암기</div>
          <div>2일차 : 문법 공부</div>
          <div>3일차 : 문제 10개 풀기</div>
        </PlanToggleCard>

        <NoticeToggleCard
          title="Nutree 서비스 오픈 안내"
          content="안녕하세요, 다람쥐와 함께하는 목표 관리 서비스 Nutree가 드디어 오픈했습니다. 작은 도토리(목표)에서 시작해 큰 나무(성취)를 키워가는 여정을 지금부터 함께할 수 있어요. 앞으로 꾸준한 업데이트와 개선으로 더 나은 서비스를 제공하겠습니다. 많은 관심과 사랑 부탁드립니다!"
          date="2025.09.19"
        />

        {/* 모달 영역 */}
        <ConfirmModal
          open={confirmOpen}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          variant="happy"
          lines={['파티에 참여 하시겠습니까?']}
        />

        <AlertModal
          open={alertOpen}
          onConfirm={handleAlert}
          title="나혼자 레벨업 ⚔️"
          description="획득 조건 : 레벨 5렙 달성"
          detail="“누구의 도움도 필요 없어! 혼자서도 충분히 강해지는 중.”"
        />

        {/* 스크롤 버튼 영역  */}
        <ScrollButtonGroup withNav />
      </ContentWrapper>
    </>
  );
}
