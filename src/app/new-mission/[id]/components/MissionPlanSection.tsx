'use client';

import Divider from '@/components/ui/Divider';
import LockPlanItem from '@/components/ui/LockPlanItem';
import WeekPlanSection from './WeekPlanSection';
import { FaExclamationTriangle } from 'react-icons/fa';
import { MissionResponse } from '@/types/mission';

interface Props {
  mission: MissionResponse['content'];
  onTaskEdit: (nextTitle: string, taskId: number, subGoalId: number) => void;
}

export default function MissionPlanSection({ mission, onTaskEdit }: Props) {
  return (
    <section className="flex flex-col gap-2">
      <p className="flex items-center gap-1 text-orange-main font-semibold text-sm">
        <FaExclamationTriangle className="text-lg" />
        수정 시 AI 추천과 다르게 진행될 수 있습니다
      </p>

      <main className="flex flex-col">
        {mission.subGoals.map((subGoal, idx) => (
          <div key={subGoal.subGoalId}>
            {idx < 2 ? (
              <WeekPlanSection
                weekLabel={`단계별 계획 ${subGoal.weekNum}주차`}
                subGoalId={subGoal.subGoalId}
                plans={subGoal.tasks.map(task => ({
                  taskId: task.taskId,
                  title: task.title
                }))}
                onTaskEdit={onTaskEdit}
              />
            ) : (
              <LockPlanItem label={`단계별 계획 ${subGoal.weekNum}주차`} />
            )}
            {idx !== mission.subGoals.length - 1 && <Divider />}
          </div>
        ))}
      </main>
    </section>
  );
}
