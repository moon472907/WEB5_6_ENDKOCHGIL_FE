'use client';

import React, { useState } from 'react';
import PartyCard from './PartyCard';
import CustomSelect from '@/app/(with-nav)/parties/components/CustomSelect';
import HotCarousel from './HotCarousel';

// API 응답 스펙을 반영한 mock 데이터 (내부 사용)
const mockApiResponse = [
  {
    id: 101,
    name: '멘탈 케어 챌린지',
    leaderId: 201,
    currentMembers: 4,
    maxMembers: 10,
    isPublic: true,
    category: 'care',
    startAt: '2025-09-21T00:00:00Z',
    endAt: '2025-10-19T23:59:59Z'
  },
  {
    id: 102,
    name: '매일 책 읽기',
    leaderId: 202,
    currentMembers: 3,
    maxMembers: 8,
    isPublic: true,
    category: 'habit',
    startAt: '2025-09-22T00:00:00Z',
    endAt: '2025-10-20T23:59:59Z'
  },
  {
    id: 103,
    name: '영어 단어 암기 챌린지',
    leaderId: 203,
    currentMembers: 2,
    maxMembers: 5,
    isPublic: false,
    category: 'study',
    startAt: '2025-09-21T00:00:00Z',
    endAt: '2025-10-19T23:59:59Z'
  },
  {
    id: 104,
    name: '출근 전 20분 러닝',
    leaderId: 204,
    currentMembers: 6,
    maxMembers: 10,
    isPublic: true,
    category: 'exercise',
    startAt: '2025-09-20T00:00:00Z',
    endAt: '2025-10-20T23:59:59Z'
  },
  {
    id: 105,
    name: '특별 이벤트(기타)',
    leaderId: 205,
    currentMembers: 1,
    maxMembers: 20,
    isPublic: true,
    category: 'etc',
    startAt: '2025-10-01T00:00:00Z',
    endAt: '2025-10-31T23:59:59Z'
  }
];
const items = mockApiResponse;

export default function PartyList() {
  const [sort, setSort] = useState<'views' | 'latest'>('views');
  const [category, setCategory] = useState<string>('');
  const [query, setQuery] = useState<string>('');

  const visible = items.filter(p => {
    const matchesCategory = category ? p.category?.toLowerCase().includes(category) : true;
    const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div>
      <div className="rounded-xl bg-bg-card-default p-4 shadow-sm mb-2">
        <input
          suppressHydrationWarning
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full rounded-lg border border-border-card-disabled px-3 py-2 mb-3 bg-basic-white focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-sub"
          placeholder="무엇을 함께 하실래요?"
          // 모바일의 기본 탭 하이라이트 제거 (WebKit)
          style={{ WebkitTapHighlightColor: 'transparent' }}
        />
        <div className="flex gap-3">
          <div className="w-30">
            <CustomSelect
              value={sort}
              onChangeAction={(v: string) => setSort(v as 'views' | 'latest')}
              placeholder="정렬"
              options={[
                { label: '조회순', value: 'views' },
                { label: '최신순', value: 'latest' }
              ]}
            />
          </div>

          <div className="w-30">
            <CustomSelect
              value={category}
              onChangeAction={(v: React.SetStateAction<string>) =>
                setCategory(v)
              }
              placeholder="카테고리"
              options={[
                { label: '전체', value: '' },
                { label: '학습', value: 'study' },
                { label: '운동', value: 'exercise' },
                { label: '생활 습관', value: 'habit' },
                { label: '멘탈 케어', value: 'care' },
                { label: '기타', value: 'etc' }
              ]}
            />
          </div>
        </div>
      </div>

      {/* 카테고리 필터가 적용된 경우 HOT 섹션 숨김 */}
      {category === '' && (
        <div className="mt-6 mb-6">
          <h3 className="text-lg font-semibold text-basic-black">
            이번 주 HOT 모집 🔥
          </h3>
          {/* 상위 4개를 캐러셀로 표시 */}
          <HotCarousel
            items={visible.slice(0, 4).map(p => ({
              id: p.id,
              name: p.name,
              category: p.category,
              startAt: p.startAt,
              endAt: p.endAt
            }))}
          />
        </div>
      )}

      {/* 나머지는 기존 카드로 렌더 (각 카드별로 아래 여백 적용) */}
      <div>
        {visible.map(p => (
          <div key={p.id} className="mb-4">
            <PartyCard
              id={p.id}
              category={p.category}
              isPublic={p.isPublic}
              title={p.name}
              startAt={p.startAt}
              endAt={p.endAt}
              people={`${p.currentMembers}/${p.maxMembers}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
