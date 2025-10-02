'use client';

import React, { useEffect, useState } from 'react';
import PartyCard from './PartyCard';
import CustomSelect from '@/app/(with-nav)/parties/components/CustomSelect';
import HotCarousel from './HotCarousel';
import {
  fetchPartiesClient,
  type PartyApiItem
} from '@/lib/api/parties/parties';

// 태그 유틸
import { mapTag, toServerEnum } from '@/lib/tag';

export default function PartyList() {
  const [sort, setSort] = useState<'views' | 'latest'>('views');
  // category는 항상 로컬 variant 기준 (study/exercise/habit/care/etc)
  const [category, setCategory] = useState<string>('');
  const [query, setQuery] = useState<string>('');

  const [items, setItems] = useState<PartyApiItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const apiSort = sort === 'views' ? 'views,desc' : 'createDate,desc';
        // API에 넘길 때는 서버 ENUM 값으로 변환
        const apiCategory = category
          ? toServerEnum[category as keyof typeof toServerEnum]
          : undefined;

        const { list } = await fetchPartiesClient(
          { page: 0, size: 20, sort: apiSort, category: apiCategory },
          ctrl.signal
        );

        if (!mounted) return;
        setItems(list ?? []);
      } catch (e: unknown) {
        if (typeof e === 'object' && e !== null) {
          const name = (e as { name?: unknown }).name;
          if (typeof name === 'string' && name === 'AbortError') return;
        }
        const msg = e instanceof Error ? e.message : String(e);
        setError(msg);
        setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
      ctrl.abort();
    };
  }, [sort, category]);

  // 클라이언트에서 필터링 (서버에서 내려온 p.category는 ENUM → mapTag로 로컬 variant 변환)
  const visible = items.filter(p => {
    const cat = mapTag(p.category);
    const matchesCategory = category ? cat === category : true;
    const matchesQuery = (p.name ?? '')
      .toLowerCase()
      .includes(query.toLowerCase());
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
              onChangeAction={(v: string) => setCategory(v)}
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

      {error && (
        <div className="text-sm text-red-500 mb-2">API 오류: {error}</div>
      )}
      {loading && <div className="text-sm text-text-sub mb-2">로딩 중...</div>}

      {category === '' && query.trim() === '' && (
        <div className="mt-6 mb-6">
          <h3 className="text-lg font-semibold text-basic-black">
            이번 주 HOT 모집 🔥
          </h3>
          <HotCarousel
            items={visible.slice(0, 4).map(p => ({
              id: p.id,
              name: p.name,
              category: mapTag(p.category),
              startAt: (p.startDate ?? p.startAt ?? '') as string,
              endAt: (p.endDate ?? p.endAt ?? '') as string
            }))}
          />
        </div>
      )}

      <div>
        {visible.map(p => (
          <div key={p.id} className="mb-4">
            <PartyCard
              id={p.id}
              category={mapTag(p.category)}
              isPublic={!!p.isPublic}
              title={p.name}
              startAt={(p.startDate ?? p.startAt ?? '') as string}
              endAt={(p.endDate ?? p.endAt ?? '') as string}
              people={`${p.currentMembers ?? 0}/${p.maxMembers ?? 0}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
