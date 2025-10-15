'use client';

import ContentWrapper from '@/components/layout/ContentWrapper';
import ProgressCard from './components/ProgressCard';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { BASE_URL } from '@/lib/api/config';
import { fetchMyPartiesServer } from '@/lib/api/parties/myparties';

export default function Page() {
  type Party = {
    id: string | number;
    name: string;
    category?: string;
    missionTitle?: string;
    missionIsCompleted?: boolean;

    /** 서버에서 계산해 주는 퍼센트 */
    myProgressRate?: number; // 0..100

    /** UI용(ExperienceBar) */
    current?: number; // 0..100
    max?: number; // 100

    currentMembers?: number;
    maxMembers?: number;
    myStatus?: 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'LEFT';
    members?: { id?: number; name?: string; status?: string }[];
  };

  // tasks/today 엔드포인트에서 올 수 있는 항목 타입
  type TaskTodayItem = {
    title?: string | null;
    taskTitle?: string | null;
    missionTitle?: string | null;
  };

  const [myParties, setMyParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);
  /** 진행중=ACCEPTED, 완료=COMPLETED|LEFT (서버가 이미 필터해서 줌) */
  const [tab, setTab] = useState<'ongoing' | 'done'>('ongoing');

  // 오늘의 태스크 매핑: missionTitle -> first task title (서브타이틀은 계속 사용)
  const [missionTaskMap, setMissionTaskMap] = useState<Map<string, string>>(
    new Map()
  );
  const [defaultTaskTitle, setDefaultTaskTitle] = useState<string | null>(null);

  /** 탭 변경 시 서버에서 myStatus 기준으로 이미 필터된 목록을 받음 */
  useEffect(() => {
    const ctrl = new AbortController();
    let mounted = true;

    (async () => {
      setLoading(true);
      try {
        const { list } = await fetchMyPartiesServer(
          tab === 'ongoing' ? 'ongoing' : 'done',
          { page: 0, size: 100 },
          ctrl.signal
        );
        if (!mounted) return;

        // 서버가 current/max/myProgressRate를 보장 → 가벼운 안전 보정만
        const normalized = (list ?? []).map(p => {
          const rate = Number(p.myProgressRate ?? p.current ?? 0);
          const safeRate = Number.isFinite(rate)
            ? Math.max(0, Math.min(100, Math.round(rate)))
            : 0;
          return {
            ...p,
            myProgressRate: safeRate,
            current: safeRate,
            max: 100
          };
        });

        setMyParties(normalized as Party[]);
      } catch (err: unknown) {
        if (
          typeof DOMException !== 'undefined' &&
          err instanceof DOMException &&
          err.name === 'AbortError'
        ) {
          return;
        }
        if (typeof err === 'object' && err !== null) {
          const name = (err as { name?: unknown }).name;
          if (typeof name === 'string' && name === 'AbortError') return;
        }
        console.error('내 파티 조회 실패', err);
        if (mounted) setMyParties([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
      ctrl.abort();
    };
  }, [tab]);

  /** 오늘의 태스크는 한 번만 가져와서 missionTitle -> taskTitle 매핑 (서브타이틀 용) */
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const base = (BASE_URL ?? '').replace(/\/$/, '');
        const res = await fetch(`${base}/api/v1/tasks/today`, {
          credentials: 'include',
          headers: { Accept: 'application/json' }
        });
        if (!res.ok) return;
        const json: unknown = await res.json().catch(() => null);
        const content =
          json &&
          typeof json === 'object' &&
          'content' in (json as Record<string, unknown>)
            ? (json as Record<string, unknown>).content
            : json;

        const arr = Array.isArray(content) ? content : content ? [content] : [];
        const map = new Map<string, string>();
        let firstTitle: string | null = null;

        for (const item of arr) {
          if (!item || typeof item !== 'object') continue;
          const t = item as TaskTodayItem;
          const title = (t.title ?? t.taskTitle ?? '') as string;
          const mTitle = (t.missionTitle ?? '') as string;
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
        console.error('오늘의 태스크 조회 실패', e);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const filtered = myParties;

  /** 평균 달성률 (myProgressRate 기반) */
  const average = useMemo(() => {
    if (!filtered.length) return 0;
    let sum = 0;
    for (const it of filtered) {
      const percent = Number(it.myProgressRate ?? it.current ?? 0);
      const safe = Number.isFinite(percent)
        ? Math.max(0, Math.min(100, percent))
        : 0;
      sum += safe / 100;
    }
    return Math.round((sum / filtered.length) * 100);
  }, [filtered]);

  const getSubtitleForParty = (p: Party) => {
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
                평균 달성률은{' '}
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
            <div className="text-sm text-gray-500 text-center mt-3">
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
                current={i.current ?? i.myProgressRate ?? 0}
                max={i.max ?? 100}
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
