'use client';
import ContentWrapper from '@/components/layout/ContentWrapper';
import ProgressCard from './components/ProgressCard';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { fetchMyPartiesWithStatus } from '@/lib/api/parties/parties';
import { BASE_URL } from '@/lib/api/config';

export default function Page() {
  type Party = {
    id: string | number;
    name: string;
    category?: string;
    missionTitle?: string;
    missionIsCompleted?: boolean;
    current?: number;
    currentMembers?: number;
    max?: number;
    maxMembers?: number;
    myStatus?: 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'LEFT';
    members?: { id?: number; name?: string; status?: string }[];
  };

  const [myParties, setMyParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'ongoing' | 'done'>('ongoing');

  // 오늘의 태스크 매핑: missionTitle -> first task title
  const [missionTaskMap, setMissionTaskMap] = useState<Map<string, string>>(new Map());
  const [defaultTaskTitle, setDefaultTaskTitle] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        // 탭에 따라 서버-결과를 members.status 기준으로 필터한 리스트를 받음
        const list = await fetchMyPartiesWithStatus(tab === 'ongoing' ? 'ongoing' : 'done');
        if (!mounted) return;
        setMyParties(list as unknown as Party[]);
      } catch (e) {
        console.error('내 파티 조회 실패', e);
        if (mounted) setMyParties([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [tab]);

  // 오늘의 태스크를 한 번만 불러와서 missionTitle 기준으로 매핑
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/v1/tasks/today`, {
          credentials: 'include',
          headers: { Accept: 'application/json' }
        });
        if (!res.ok) return;
        const json: unknown = await res.json().catch(() => null);
        const content = (json && typeof json === 'object' && 'content' in (json as Record<string, unknown>))
          ? (json as Record<string, unknown>).content
          : json;
        const arr = Array.isArray(content) ? content : (content ? [content] : []);
        const map = new Map<string, string>();
        let firstTitle: string | null = null;

        for (const item of arr) {
          if (!item || typeof item !== 'object') continue;
          const it = item as Record<string, unknown>;
          const title = (it.title ?? it['taskTitle'] ?? '') as string;
          const mTitle = (it.missionTitle ?? it['missionTitle'] ?? '') as string;

          if (!firstTitle && title) firstTitle = title;
          if (mTitle && title && !map.has(mTitle)) {
            map.set(mTitle, title);
          }
        }

        if (mounted) {
          setMissionTaskMap(map);
          setDefaultTaskTitle(firstTitle);
        }
      } catch (e) {
        // 실패 시 무시 (default 유지)
        console.error('오늘의 태스크 조회 실패', e);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // 이제 filtered는 이미 탭 기준으로 필터된 myParties 사용
  const filtered = myParties;

  const average = useMemo(() => {
    if (!filtered.length) return 0;
    let sum = 0;
    let count = 0;
    for (const it of filtered) {
      const max = it.max ?? it.maxMembers ?? 100;
      const current = it.current ?? it.currentMembers ?? 0;
      if (max > 0) {
        sum += Math.min(1, Math.max(0, current / max));
        count++;
      }
    }
    return count ? Math.round((sum / count) * 100) : 0;
  }, [filtered]);

  const getSubtitleForParty = (p: Party) => {
    // 우선 missionTitle로 매핑, 없으면 기본 오늘의 태스크, 없으면 빈 문자열
    const missionTitle = p.missionTitle ?? '';
    return missionTaskMap.get(missionTitle) ?? defaultTaskTitle ?? '';
  };

  return (
    <ContentWrapper withNav className="relative overflow-hidden z-0">
      <div className="min-h-screen">
        {/* 상단 요약 */}
        <div className="flex justify-center items-center gap-4 relative min-h-[130px]">
          <Image
            src="/images/cheerup.png"
            alt="다람쥐 응원"
            width={120}
            height={120}
            className="object-contain flex-shrink-0"
          />

          {tab === 'ongoing' ? (
            <div className="text-center w-[280px]">
              <p className="text-lg text-basic-black leading-relaxed">
                이번주 평균 달성률은{' '}
                <strong className="text-orange-main">{average}%</strong>
              </p>
              <p className="text-lg text-basic-black leading-relaxed">
                조금만 더 힘내볼까요?🔥
              </p>
            </div>
          ) : (
            <div className="text-center w-[280px]">
              <p className="text-lg text-basic-black leading-relaxed">
                수고하셨습니다! 🎉
              </p>
              <p className="text-lg text-basic-black leading-relaxed">
                완료된 파티들을 확인해보세요.
              </p>
              <p className="text-sm text-text-sub leading-relaxed mt-1">
                다음 목표를 준비해볼까요? 🌱
              </p>
            </div>
          )}
        </div>

        {/* 탭 버튼 */}
        <div className="flex gap-4 relative mt-4">
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

        {/* 리스트 렌더링 */}
        <div className="mt-3 relative flex flex-col gap-y-3 pb-24 z-20">
          {loading ? (
            <div className="text-sm text-text-sub">로딩 중...</div>
          ) : filtered.length === 0 ? (
            <div className="text-sm text-gray-500 text-center">
              {tab === 'ongoing'
                ? '진행 중인 파티가 없습니다.'
                : '완료된 파티가 없습니다.'}
            </div>
          ) : (
            filtered.map(i => (
              <ProgressCard
                key={i.id}
                id={i.id}
                title={i.name}
                tag={i.category}
                subtitle={getSubtitleForParty(i)}
                current={i.current ?? i.currentMembers ?? 0}
                max={i.max ?? i.maxMembers ?? 100}
                compact={tab === 'done'}
              />
            ))
          )}
        </div>
      </div>

      {/* 하단 이미지: 뷰포트 기준으로 고정 */}
      <div className="absolute bottom-0 right-0 pointer-events-none z-0">
        <div
          className="pointer-events-none w-[500px] min-w-[500px] max-w-[600px]"
          style={{ transform: 'translateX(8%)' }}
        >
          <Image
            src="/images/sleep.png"
            alt="다람쥐"
            width={500}
            height={500}
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </ContentWrapper>
  );
}
