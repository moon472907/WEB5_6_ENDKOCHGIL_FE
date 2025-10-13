'use client';
import ContentWrapper from '@/components/layout/ContentWrapper';
import Header from '@/components/layout/Header';
import PlanToggleCard from '@/components/ui/PlanToggleCard';
import DayPlanItem from '@/components/ui/DayPlanItem';
import Tag from '@/components/ui/Tag';
import Button from '@/components/ui/Button';
import { useEffect, useState } from 'react';
import LockPlanItem from '@/components/ui/LockPlanItem';
import Divider from '@/components/ui/Divider';
import ConfirmModal from '@/components/modal/ConfirmModal';
import { useSearchParams } from 'next/navigation';
import { BASE_URL } from '@/lib/api/config';
import { updateWeekTasks } from '@/lib/api/mission/mission';
import { MissionContent, MissionSubGoal, MissionTask } from '@/types/mission';

// 추가: 파티 상세/태그 매핑 함수 import
import {
  fetchPartyDetailClient,
  type PartyApiItem
} from '@/lib/api/parties/parties';
import { mapTag, variantToKorean } from '@/lib/tag';
// 추가: 현재 사용자 정보
import { getMyInfo } from '@/lib/api/member';

type WeekState = 'confirmed' | 'current' | 'next' | 'locked';
type LocalTask = {
  taskId: number;
  title: string;
  dayNum: number;
  canEdit?: boolean;
  status?: string;
};
type LocalWeek = {
  id: number;
  title: string;
  weekNum: number;
  weekState: WeekState;
  startDate?: string | null;
  endDate?: string | null;
  tasks: LocalTask[];
};

export default function PartyPlanInner() {
  const searchParams = useSearchParams();
  const partyIdParam = searchParams.get('partyId');
  const partyId = partyIdParam ? Number(partyIdParam) : null;

  // 변경: isLeader 상태를 서버 데이터로 판정
  const [isLeader, setIsLeader] = useState<boolean>(false);

  const [weeks, setWeeks] = useState<LocalWeek[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingWeekId, setPendingWeekId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // pendingChanges: subGoalId -> Map(taskId -> newTitle)
  const [pendingChanges, setPendingChanges] = useState<
    Record<number, Record<number, string>>
  >({});

  // 파티/미션 헤더용 상태
  const [partyName, setPartyName] = useState<string>('');
  const [missionCategory, setMissionCategory] = useState<string | undefined>(
    undefined
  );
  const [missionTitle, setMissionTitle] = useState<string>('');

  // 추가: UI variant 결정 함수 (DayPlanItem에 전달할 variant 값)
  const getUiVariant = (weekState: WeekState) =>
    weekState === 'confirmed'
      ? 'past'
      : weekState === 'current'
      ? 'current'
      : 'next';

  // 추가: next 주차 편집 허용 판정 로직
  const isEditableNext = (
    weekState: WeekState,
    isInitialCreation: boolean,
    startDate?: string | null,
    anyEdited = false
  ) => {
    if (weekState !== 'next') return false;
    if (isInitialCreation) return false; // 생성 직후(초기) next는 수정 금지(확인만)
    if (anyEdited) return false; // 이미 편집된 주차는 더 이상 편집 불가
    if (!startDate) return true; // 시작일 정보 없으면 허용
    const allowDate = new Date(startDate);
    allowDate.setDate(allowDate.getDate() - 7);
    return new Date() >= allowDate; // 시작일 7일 전부터 편집 허용
  };

  // 미션 로드 및 weeks 상태 구성
  useEffect(() => {
    let mounted = true;
    if (!partyId) {
      setWeeks([]);
      setLoading(false);
      return;
    }
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${BASE_URL}/api/v1/missions/all`, {
          credentials: 'include',
          headers: { Accept: 'application/json' }
        });
        if (!res.ok) throw new Error(`missions/all HTTP ${res.status}`);
        const json = await res.json();
        const active = Array.isArray(json?.content?.activeMissions)
          ? json.content.activeMissions
          : [];
        const completed = Array.isArray(json?.content?.completedMissions)
          ? json.content.completedMissions
          : [];
        const all = [...active, ...completed] as unknown[];

        const isMissionContent = (v: unknown): v is MissionContent =>
          typeof v === 'object' &&
          v !== null &&
          'missionId' in (v as Record<string, unknown>);

        const mission = all.find(
          m =>
            isMissionContent(m) &&
            m.partyId !== undefined &&
            m.partyId !== null &&
            Number(m.partyId) === partyId
        ) as MissionContent | undefined;

        if (!mission) {
          if (mounted) {
            setWeeks([]);
            setError('해당 파티의 미션을 찾을 수 없습니다.');
          }
          return;
        }

        // 미션 제목/카테고리 상태 저장 (UI 폴백)
        if (mounted) {
          setMissionTitle(String(mission.title ?? ''));
          setMissionCategory(String(mission.category ?? ''));
        }

        // 현재 사용자 id 조회
        const extractMemberId = (v: unknown): number | null => {
          if (typeof v !== 'object' || v === null) return null;
          const r = v as Record<string, unknown>;
          const candidate = r.memberId ?? r.id ?? null;
          if (typeof candidate === 'number') return candidate;
          if (
            typeof candidate === 'string' &&
            candidate.trim() !== '' &&
            !Number.isNaN(Number(candidate))
          )
            return Number(candidate);
          return null;
        };

        let myId: number | null = null;
        try {
          const me = await getMyInfo();
          myId = extractMemberId(me);
        } catch {
          myId = null;
        }

        // 파티 리더 id 추출
        const extractLeaderId = (v: unknown): number | null => {
          if (typeof v !== 'object' || v === null) return null;
          const r = v as Record<string, unknown>;
          const direct = r.leaderId ?? null;
          if (typeof direct === 'number') return direct;
          if (
            typeof direct === 'string' &&
            direct.trim() !== '' &&
            !Number.isNaN(Number(direct))
          )
            return Number(direct);

          const leaderObj = r.leader;
          if (typeof leaderObj === 'object' && leaderObj !== null) {
            const lr = leaderObj as Record<string, unknown>;
            const lid = lr.id ?? null;
            if (typeof lid === 'number') return lid;
            if (
              typeof lid === 'string' &&
              lid.trim() !== '' &&
              !Number.isNaN(Number(lid))
            )
              return Number(lid);
          }
          return null;
        };

        // 파티 테이블의 NAME을 우선으로 사용 및 리더 판정
        let leaderFlag = false;
        try {
          const partyDetail: PartyApiItem = await fetchPartyDetailClient(
            partyId
          );
          if (mounted) setPartyName(String(partyDetail.name ?? ''));
          const leaderId = extractLeaderId(partyDetail);
          leaderFlag =
            leaderId !== null &&
            myId !== null &&
            Number(leaderId) === Number(myId);
        } catch {
          if (mounted) setPartyName(String(mission.title ?? '파티 계획'));
        }

        if (mounted) setIsLeader(Boolean(leaderFlag));

        // 결정 기준: mission.currentWeek (1~4)
        const currentWeek =
          typeof mission.currentWeek === 'number' ? mission.currentWeek : 1;

        const subGoalsArr: MissionSubGoal[] = Array.isArray(mission.subGoals)
          ? mission.subGoals
          : [];

        // mapped 생성
        const mapped: LocalWeek[] = subGoalsArr.map(sg => {
          const wkNum = Number(sg.weekNum ?? 0) || 0;

          const tasksSrc: MissionTask[] = Array.isArray(sg.tasks)
            ? sg.tasks
            : [];
          const anyEdited = tasksSrc.some(t => Boolean(t.hasBeenEdited));

          // 기본 상태 결정
          let weekState: WeekState = 'locked';
          if (wkNum < currentWeek) {
            weekState = 'confirmed';
          } else if (wkNum === currentWeek) {
            weekState = 'current';
          } else if (wkNum === currentWeek + 1) {
            weekState = 'next';
          } else {
            weekState = 'locked';
          }

          const isInitialCreation = currentWeek === 1;
          const tasks: LocalTask[] = tasksSrc.map(t => {
            const baseCanEdit = Boolean(t.canEdit ?? true);
            const computedCanEdit =
              weekState === 'current'
                ? false
                : weekState === 'next'
                ? isEditableNext(
                    weekState,
                    isInitialCreation && wkNum === 2 ? true : isInitialCreation,
                    sg.startDate ?? mission.startDate ?? null,
                    anyEdited
                  ) && baseCanEdit
                : false;

            return {
              taskId: Number(t.taskId ?? 0),
              title: String(t.title ?? ''),
              dayNum: Number(t.dayNum ?? 0),
              canEdit: computedCanEdit,
              status: String(t.status ?? 'PENDING')
            };
          });

          return {
            id: Number(sg.subGoalId ?? 0),
            title: String(sg.title ?? `주차 ${wkNum}`),
            weekNum: wkNum,
            weekState,
            startDate: sg.startDate ?? null,
            endDate: sg.endDate ?? null,
            tasks
          } as LocalWeek;
        });

        if (mounted) {
          setWeeks(mapped);
        }
      } catch (err) {
        console.error('미션 로드 실패', err);
        if (mounted) setError('미션 로드 실패');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [partyId]);

  // DayPlanItem onSave -> 로컬 반영 + pendingChanges 기록
  const handleTaskSave = (
    nextTitle: string,
    taskId: number,
    subGoalId: number
  ) => {
    setWeeks(prev =>
      prev.map(w =>
        w.id === subGoalId
          ? {
              ...w,
              tasks: w.tasks.map(t =>
                t.taskId === taskId ? { ...t, title: nextTitle } : t
              )
            }
          : w
      )
    );

    setPendingChanges(prev => {
      const copy: Record<number, Record<number, string>> = { ...prev };
      if (!copy[subGoalId]) copy[subGoalId] = {};
      copy[subGoalId][taskId] = nextTitle;
      return copy;
    });
  };

  const handleConfirm = async (weekId: number) => {
    const week = weeks.find(w => w.id === weekId);
    if (!week) return;

    const changesForWeek = pendingChanges[weekId] ?? {};
    const tasksPayload = Object.keys(changesForWeek).map(k => ({
      taskId: Number(k),
      title: changesForWeek[Number(k)]
    }));

    try {
      if (tasksPayload.length > 0) {
        await updateWeekTasks(weekId, tasksPayload);
      }

      setWeeks(prev =>
        prev.map(w =>
          w.id === weekId
            ? {
                ...w,
                weekState: w.weekState === 'next' ? 'current' : w.weekState
              }
            : w
        )
      );

      setPendingChanges(prev => {
        const copy = { ...prev };
        delete copy[weekId];
        return copy;
      });
    } catch (err) {
      console.error('주차 태스크 업데이트 실패', err);
      setError('수정 저장에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <>
      <Header title="파티 계획" />
      <ContentWrapper withNav>
        <div className="space-y-4">
          <div className="flex gap-3">
            <h3 className="text-button-point font-semibold mt-1 text-lg">
              {partyName || missionTitle || '파티 계획'}
            </h3>
            <Tag variant={mapTag(missionCategory)} size="md">
              {variantToKorean(missionCategory)}
            </Tag>
          </div>
          <div className="text-md text-text-sub">
            일주일 전부터 미션 확인과 수정이 가능해요!
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="text-sm text-text-sub">로딩 중...</div>
            ) : error ? (
              <div className="text-sm text-red-500">{error}</div>
            ) : (
              weeks.map((w, idx) => {
                const effectiveWeekState =
                  !isLeader && w.weekState === 'next'
                    ? ('current' as WeekState)
                    : w.weekState;
                const isLast = idx === weeks.length - 1;

                if (w.weekState === 'locked') {
                  return (
                    <div key={w.id} className="space-y-2">
                      <LockPlanItem label={w.title} />
                      {!isLast && <Divider />}
                    </div>
                  );
                }

                return (
                  <div key={w.id} className="space-y-2">
                    <PlanToggleCard
                      title={w.title}
                      defaultOpen={w.weekNum === 1}
                    >
                      <ul className="space-y-2">
                        {w.tasks.map(t => (
                          <DayPlanItem
                            key={t.taskId}
                            day={t.dayNum}
                            title={t.title}
                            variant={getUiVariant(effectiveWeekState)}
                            taskId={t.taskId}
                            subGoalId={w.id}
                            onSave={handleTaskSave}
                            canEdit={t.canEdit}
                          />
                        ))}
                      </ul>

                      {effectiveWeekState === 'next' &&
                        isLeader &&
                        pendingChanges[w.id] &&
                        Object.keys(pendingChanges[w.id]).length > 0 && (
                          <div className="mt-3 flex justify-end">
                            <Button
                              variant="basic"
                              fullWidth
                              onClick={() => {
                                setPendingWeekId(w.id);
                                setConfirmOpen(true);
                              }}
                            >
                              수정 완료
                            </Button>
                          </div>
                        )}
                    </PlanToggleCard>
                    {!isLast && <Divider />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </ContentWrapper>

      <ConfirmModal
        open={confirmOpen}
        lines={['계획을 수정하시겠어요?']}
        onConfirm={() => {
          if (pendingWeekId !== null) handleConfirm(pendingWeekId);
          setConfirmOpen(false);
          setPendingWeekId(null);
        }}
        onCancel={() => {
          setConfirmOpen(false);
          setPendingWeekId(null);
        }}
        confirmText="확인"
        cancelText="취소"
      />
    </>
  );
}
