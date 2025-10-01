'use client';
import ContentWrapper from '@/components/layout/ContentWrapper';
import ProgressCard from './components/ProgressCard';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import { useMemo, useState } from 'react';

export default function Page() {
  const items = useMemo(
    () => [
      {
        id: 1,
        title: '토익 공부 500점 목표',
        tag: '학습',
        subtitle: '단어 100개 외우기',
        current: 40,
        max: 100
      },
      {
        id: 2,
        title: '책읽기',
        tag: '멘탈케어',
        subtitle: '책 한권 읽기',
        current: 66,
        max: 100
      },
      {
        id: 3,
        title: '숨쉬기',
        tag: '운동',
        subtitle: '멈추면 안돼',
        current: 0,
        max: 100
      },
      {
        id: 4,
        title: '매일 책 읽기',
        tag: '생활 습관',
        subtitle: '100p 읽기',
        current: 14,
        max: 100
      }
    ],
    []
  );

  const average = useMemo(() => {
    if (!items.length) return 0;
    let sum = 0;
    let count = 0;
    for (const it of items) {
      if (it.max > 0) {
        sum += Math.min(1, Math.max(0, it.current / it.max));
        count++;
      }
    }
    return count ? Math.round((sum / count) * 100) : 0;
  }, [items]);

  // 탭 상태: 'ongoing' | 'done'
  const [tab, setTab] = useState<'ongoing' | 'done'>('ongoing');

  return (
    <>
      <ContentWrapper withNav className="relative overflow-hidden pb-40 z-0">
        <div>
          {/* 상단 일러스트 문구 */}
          <div className="flex justify-center gap-3 items-center relative">
            <Image
              src="/images/cheerup.png"
              alt="진행 현황 일러스트"
              width={120}
              height={120}
            />
            <div className="flex flex-col justify-center items-center text-center">
              <p className="text-lg text-basic-black leading-relaxed">
                이번주 평균 달성률은{' '}
                <strong className="text-orange-main">{average}%</strong>!!
                <br />
                조금만 더 힘내볼까요?🔥
              </p>
            </div>
          </div>

          {/* 진행중 / 완료 버튼 */}
          <div className="flex gap-4 relative">
            <Button
              variant={tab === 'ongoing' ? 'basic' : 'unselected'}
              size="md"
              fullWidth
              onClick={() => setTab('ongoing')}
            >
              진행중
            </Button>
            <Button
              variant={tab === 'done' ? 'basic' : 'unselected'}
              size="md"
              fullWidth
              onClick={() => setTab('done')}
            >
              완료
            </Button>
          </div>

          <div className="mt-3 relative flex flex-col gap-y-3 pb-24 z-20">
            {items.map(i => (
              <ProgressCard
                key={`${i.id}-${i.title}`}
                id={i.id}
                title={i.title}
                tag={i.tag}
                subtitle={i.subtitle}
                current={i.current}
                max={i.max}
                compact={tab === 'done'}
              />
            ))}
          </div>
        </div>

        <div className="fixed bottom-0 right-2/6 pointer-events-none">
          <Image
            src="/images/sleep.png"
            alt="다람쥐"
            width={500}
            height={500}
            className="object-contain"
          />
        </div>
      </ContentWrapper>
    </>
  );
}
