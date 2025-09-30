'use client';
import ContentWrapper from '@/components/layout/ContentWrapper';
import Header from '@/components/layout/Header';
import PlanToggleCard from '@/components/ui/PlanToggleCard';
import DayPlanItem from '@/components/ui/DayPlanItem';
import { useMemo } from 'react';

export default function Page() {
  // mock: 각 주차별 일차 데이터 (UI 전용)
  const weeks = useMemo(
    () => [
      {
        id: 1,
        title: '단계별 계획 1주차',
        days: [
          { day: 1, title: '단어 10개 암기', variant: 'past' },
          { day: 2, title: '문법 공부', variant: 'past' },
          { day: 3, title: '문제 10개 풀기', variant: 'past' },
          { day: 4, title: '문제 및 복습', variant: 'past' },
          { day: 5, title: '독해하기', variant: 'past' },
          { day: 6, title: '리스닝 공부하기', variant: 'past' },
          { day: 7, title: '문제 50개 풀기', variant: 'past' }
        ]
      },
      {
        id: 2,
        title: '단계별 계획 2주차',
        days: [
          { day: 1, title: '단어 10개 암기', variant: 'current' },
          { day: 2, title: '문법 공부', variant: 'current' },
          { day: 3, title: '문제 10개 풀기', variant: 'current' },
          { day: 4, title: '문제 및 복습', variant: 'current' },
          { day: 5, title: '독해하기', variant: 'current' },
          { day: 6, title: '리스닝 공부하기', variant: 'current' },
          { day: 7, title: '문제 50개 풀기', variant: 'current' }
        ]
      },
      {
        id: 3,
        title: '단계별 계획 3주차',
        days: [
          { day: 1, title: '단어 10개 암기', variant: 'next' },
          { day: 2, title: '문법 공부', variant: 'next' },
          { day: 3, title: '문제 10개 풀기', variant: 'next' },
          { day: 4, title: '문제 및 복습', variant: 'next' },
          { day: 5, title: '독해하기', variant: 'next' },
          { day: 6, title: '리스닝 공부하기', variant: 'next' },
          { day: 7, title: '문제 50개 풀기', variant: 'next' }
        ]
      }
    ],
    []
  );

  return (
    <>
      <Header title="파티 계획" />
      <ContentWrapper withNav>
        <div className="space-y-4">
          {/* 파티 기본 정보 영역 (간단한 요약) */}
          <div className="rounded-lg bg-basic-white p-3 shadow-sm">
            <h3 className="text-base font-semibold mb-1">토익 공부 500점</h3>
            <div className="text-sm text-test-sub">일별로 전부다 미션 확인과 수정이 가능하도록 구성</div>
          </div>

          {/* 주차별 토글 카드들 */}
          <div className="space-y-3">
            {weeks.map(w => (
              <PlanToggleCard key={w.id} title={w.title} defaultOpen={w.id === 1}>
                <ul className="space-y-2">
                  {w.days.map(d => (
                    <DayPlanItem
                      key={d.day}
                      day={d.day}
                      title={d.title}
                      variant={(d.variant as 'past' | 'current' | 'next') || 'next'}
                    />
                  ))}
                </ul>
              </PlanToggleCard>
            ))}
          </div>
        </div>
      </ContentWrapper>
    </>
  );
}
