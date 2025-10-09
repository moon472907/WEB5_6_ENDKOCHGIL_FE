'use client';

import { formatToday } from '@/utils/date';
import MissionCard from '@/app/home/components/mission/MissionCard';
import EmptyMissionCard from '@/app/home/components/mission/EmptyMissionCard';
import NewMissionButton from '@/app/home/components/mission/NewMissionButton';
import type { Task } from '@/app/home/types/task';
import { useState } from 'react';

interface MissionListSectionProps {
  tasks: Task[];
}

export default function MissionListSection({ tasks }: MissionListSectionProps) {
  const [taskList, setTaskList] = useState<Task[]>(tasks);

  const handleStatusChange = (
    taskId: number,
    newStatus: 'PENDING' | 'COMPLETED'
  ) => {
    setTaskList(prev =>
      prev.map(t => (t.taskId === taskId ? { ...t, status: newStatus } : t))
    );
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
            {completedCount}/{tasks.length}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {tasks.length > 0 ? (
          tasks.map(task => (
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
