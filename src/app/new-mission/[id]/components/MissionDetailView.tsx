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

  // 로그인 사용자 정보(알림용) 가져오기
  useEffect(() => {
    async function fetchMemberId() {
      try {
        const data = await getMyInfo();
        setMemberId(data.id);
        console.log('로그인한 사용자 ID:', data.id);
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

        console.log('수정된 항목 업데이트 완료');
      } else {
        console.log('수정된 항목이 없지만 알림을 생성합니다.');
      }

      console.log('memberId === ', memberId);

      // (2) 수정 유무 관계없이 알림 생성
      if (memberId) {
        await createNotification({
          memberId,
          message: `미션 "${mission.title}"의 계획을 생성했습니다.`,
          type: 'MESSAGE'
        });
      }

      // (3) 홈으로 이동
      alert('변경 사항이 성공적으로 처리되었습니다!');
      router.push('/');
    } catch (err) {
      console.error('Task 수정 또는 알림 처리 실패:', err);
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <Header title="생성한 미션 확인" />
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
            수정사항 저장
          </Button>
        </form>
      </ContentWrapper>
    </>
  );
}
