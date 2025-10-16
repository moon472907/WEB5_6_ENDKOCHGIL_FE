'use client';

import Header from '@/components/layout/Header';
import ContentWrapper from '@/components/layout/ContentWrapper';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MissionResponse } from '@/types/mission';
import MissionInfoSection from './MissionInfoSection';
import MissionPlanSection from './MissionPlanSection';
import { updateWeekTasks } from '@/lib/api/mission/mission';
import { createNotification } from '@/lib/api/notification';
import { getMyInfo } from '@/lib/api/member';
import { useNotificationStore } from '@/app/home/components/notification/useNotificationStore';
import AlertModal from '@/components/modal/AlertModal';

interface EditedTask {
  subGoalId: number;
  taskId: number;
  title: string;
}

interface Props {
  mission: MissionResponse['content'];
}

export default function MissionDetailView({ mission: initialMission }: Props) {
  const router = useRouter();
  const [mission, setMission] = useState(initialMission); // 화면에 보여줄 미션 데이터
  const [editedTasks, setEditedTasks] = useState<EditedTask[]>([]); // 사용자가 실제로 수정한 task
  const [memberId, setMemberId] = useState<number | null>(null);
  const addNotification = useNotificationStore(state => state.addNotification);
  const [alertOpen, setAlertOpen] = useState(false); // AlertModal 상태

  // 로그인 사용자 정보(알림용) 가져오기
  useEffect(() => {
    async function fetchMemberId() {
      try {
        const data = await getMyInfo();
        setMemberId(data.id);
        // console.log('로그인한 사용자 ID:', data.id);
      } catch (err) {
        console.error('memberID 조회 실패:', err);
      }
    }
    fetchMemberId();
  }, []);

  // 개별 Task 제목 수정 시 로컬 상태 업데이트
  const handleTaskEdit = (
    nextTitle: string,
    taskId: number,
    subGoalId: number
  ) => {
    setMission(prev => {
      const updatedSubGoals = prev.subGoals.map(subGoal =>
        subGoal.subGoalId === subGoalId
          ? {
              ...subGoal,
              tasks: subGoal.tasks.map(task =>
                task.taskId === taskId ? { ...task, title: nextTitle } : task
              )
            }
          : subGoal
      );
      return { ...prev, subGoals: updatedSubGoals };
    });

    setEditedTasks(prev => {
      const filtered = prev.filter(t => t.taskId !== taskId);
      return [...filtered, { subGoalId, taskId, title: nextTitle }];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // (1) 수정된 항목이 있으면 주차별로 묶어서 업데이트 요청
      if (editedTasks.length > 0) {
        const grouped = editedTasks.reduce<Record<number, EditedTask[]>>(
          (acc, t) => {
            if (!acc[t.subGoalId]) acc[t.subGoalId] = [];
            acc[t.subGoalId].push(t);
            return acc;
          },
          {}
        );

        await Promise.all(
          Object.entries(grouped).map(([subGoalId, tasks]) =>
            updateWeekTasks(
              Number(subGoalId),
              tasks.map(t => ({
                taskId: t.taskId,
                title: t.title
              }))
            )
          )
        );
      }

      // (2) 수정 유무 관계없이 알림 생성
      if (memberId) {
        const res = await createNotification({
          memberId,
          message: `새로운 미션 "${mission.title}"을 생성했어요!`,
          type: 'MESSAGE'
        });
        addNotification(res.content);
      }

      // (3) 홈으로 이동
      router.push('/');
    } catch (err) {
      console.error('미션 생성 완료 또는 알림 처리 실패:', err);
      setAlertOpen(true);
    }
  };

  return (
    <>
      <Header title="미션 계획" />
      <ContentWrapper padding="xl">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-12 font-medium"
        >
          <MissionInfoSection />
          <MissionPlanSection mission={mission} onTaskEdit={handleTaskEdit} />
          <Button
            type="submit"
            variant="basic"
            size="lg"
            fullWidth
            className="flex mt-20 mb-5"
          >
            미션 생성 완료
          </Button>
        </form>
        <AlertModal
          open={alertOpen}
          onConfirm={() => setAlertOpen(false)}
          title="미션 상세 수정 실패"
          detail={'완료된 미션 수정 중 오류가 발생했어요'}
          confirmText="확인"
        />
      </ContentWrapper>
    </>
  );
}
