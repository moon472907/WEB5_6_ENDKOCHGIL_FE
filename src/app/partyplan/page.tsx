'use client';
import ContentWrapper from '@/components/layout/ContentWrapper';
import Header from '@/components/layout/Header';
import PlanToggleCard from '@/components/ui/PlanToggleCard';
import DayPlanItem from '@/components/ui/DayPlanItem';
import Tag from '@/components/ui/Tag';
import Button from '@/components/ui/Button';
import LockPlanItem from './components/LockPlanItem';
import { useState } from 'react';

type WeekState = 'confirmed' | 'current' | 'next' | 'locked';

export default function Page() {
  const isLeader = true; // 실제는 API/컨텍스트로 판단

  // 상태로 관리: 서버 대신 로컬 mock state
  const [weeks, setWeeks] = useState(() => [
    {
      id: 1,
      title: '단계별 계획 1주차',
      weekState: 'confirmed' as WeekState,
      days: [
        '단어 10개 암기',
        '문법 공부',
        '문제 10개 풀기',
        '문법 문제 5문제 풀기',
        '독해하기',
        '리스닝 공부하기',
        '문제 50개 풀기'
      ]
    },
    {
      id: 2,
      title: '단계별 계획 2주차',
      weekState: 'current' as WeekState,
      days: [
        '단어 10개 암기',
        '문법 공부',
        '문제 10개 풀기',
        '문법 문제 5문제 풀기',
        '독해하기',
        '리스닝 공부하기',
        '문제 50개 풀기'
      ]
    },
    {
      id: 3,
      title: '단계별 계획 3주차',
      weekState: 'next' as WeekState,
      days: [
        '단어 10개 암기',
        '문법 공부',
        '문제 10개 풀기',
        '문제 및 복습',
        '독해하기',
        '리스닝 공부하기',
        '문제 50개 풀기'
      ]
    },
    {
      id: 4,
      title: '단계별 계획 4주차',
      weekState: 'locked' as WeekState,
      days: [
        '단어 10개 암기',
        '문법 공부',
        '문제 10개 풀기',
        '문제 및 복습',
        '독해하기',
        '리스닝 공부하기',
        '문제 50개 풀기'
      ]
    }
  ]);

  // "수정 완료" 클릭 핸들러 — 서버 호출 후 상태 갱신 로직으로 교체하세요
  const handleConfirm = async (weekId: number) => {
    setWeeks(prev =>
      prev.map(w =>
        w.id === weekId ? { ...w, weekState: w.weekState === 'next' ? 'current' : w.weekState } : w
      )
    );
  };

  // weekState -> DayPlanItem variant 매핑
  const mapVariant = (ws: WeekState) => {
    if (ws === 'confirmed') return 'past';
    if (ws === 'current') return 'current';
    return 'next'; // next / locked -> 보여주기 위해 'next' 사용 (locked는 pointer-events-none 처리)
  };

  return (
    <>
      <Header title="파티 계획" />
      <ContentWrapper withNav>
        <div className="space-y-4">
          <div className="flex gap-3">
            <h3 className="text-button-point font-semibold mt-1 text-lg">토익 공부 500점</h3>
            <Tag variant="study" size="md">학습</Tag>
          </div>
          <div className="text-md text-text-sub">일주일 전부터 미션 확인과 수정이 가능해요!</div>

          <div className="space-y-3">
            {weeks.map(w => {
              // 비회원(또는 파티장이 아닌 사용자)은 'next' 주차를 편집 불가로 보여야 하므로
              // 렌더링 전 실제 표시할 weekState를 결정한다.
              const effectiveWeekState =
                !isLeader && w.weekState === 'next' ? ('current' as WeekState) : w.weekState;

              // locked이면 LockPlanItem 형태로 노출 (days는 숨김)
              if (w.weekState === 'locked') {
                return (
                  <div key={w.id} className="space-y-2">
                    <LockPlanItem label={w.title} />
                    <p className="text-xs text-gray-07 px-1">
                      {w.id === 4
                        ? '3주차 시작 7일 전부터 확인 및 수정이 가능합니다.'
                        : '잠금된 주차입니다.'}
                    </p>
                    {/* days 숨김: 잠금 상태에서는 항목을 보여주지 않음 */}
                  </div>
                );
              }

              // 그 외(confirmed/current/next)는 토글 카드로 렌더
              return (
                <PlanToggleCard key={w.id} title={w.title} defaultOpen={w.id === 1}>
                  <ul className="space-y-2">
                    {w.days.map((title, idx) => (
                      <DayPlanItem
                        key={idx}
                        day={idx + 1}
                        title={title}
                        variant={mapVariant(effectiveWeekState)}
                      />
                    ))}
                  </ul>

                  {/* 수정 완료 버튼: 실제 표시되는 상태(effectiveWeekState)가 'next'인 경우에만, + 파티장일 때만 노출 */}
                  {effectiveWeekState === 'next' && isLeader && (
                    <div className="mt-3 flex justify-end">
                      <Button variant="basic" onClick={() => handleConfirm(w.id)}>
                        수정 완료
                      </Button>
                    </div>
                  )}
                </PlanToggleCard>
              );
            })}
          </div>
        </div>
      </ContentWrapper>
    </>
  );
}
