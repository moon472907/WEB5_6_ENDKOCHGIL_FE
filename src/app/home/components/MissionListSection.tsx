'use client';

import { formatToday } from '@/utils/date';
import MissionCard from '@/app/home/components/mission/MissionCard';
import EmptyMissionCard from '@/app/home/components/mission/EmptyMissionCard';
import NewMissionButton from '@/app/home/components/mission/NewMissionButton';
import type { Task } from '@/app/home/types/task';
import { useState } from 'react';

interface MissionListSectionProps {
  initialTasks: Task[];
  onRefreshData?: () => void;
}

export default function MissionListSection({
  initialTasks,
  onRefreshData
}: MissionListSectionProps) {
  const [taskList, setTaskList] = useState<Task[]>(initialTasks);

  const handleStatusChange = async (
    taskId: number,
    newStatus: 'PENDING' | 'COMPLETED'
  ) => {
    // Checkbox 낙관적 업데이트
    setTaskList(prev =>
      prev.map(t => (t.taskId === taskId ? { ...t, status: newStatus } : t))
    );

    // 상위에서 최신 데이터 전체를 다시 불러오게 요청
    onRefreshData?.();
  };

  const completedCount = taskList.filter(t => t.status === 'COMPLETED').length;

  return (
    <section className="flex flex-col gap-3 px-7 py-5 relative flex-1">
      <div className="flex flex-col gap-8 px-2">
        <h2 className="text-lg font-semibold text-button-point">
          {formatToday()}
        </h2>
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-button-point">
            오늘의 미션
          </span>
          <span className="text-lg font-semibold text-text-sub">
            {completedCount}/{taskList.length}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {taskList.length > 0 ? (
          taskList.map(task => (
            <MissionCard
              key={task.taskId}
              task={task}
              onStatusChange={handleStatusChange}
            />
          ))
        ) : (
          <EmptyMissionCard />
        )}
      </div>

      <NewMissionButton />
    </section>
  );
}
