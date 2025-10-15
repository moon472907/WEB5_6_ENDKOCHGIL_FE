'use client';

import { useCallback, useState } from 'react';
import { Task } from '@/app/home/types/task';
import Checkbox from './Checkbox';
import { updateTaskCompletion } from '@/lib/api/home/task';
import { getTodayString } from '@/utils/date';
import { createNotification } from '@/lib/api/notification';

interface CheckboxWrapperProps {
  task: Task;
  memberId: number;
  onStatusChange: (taskId: number, newStatus: 'PENDING' | 'COMPLETED') => void;
}

export default function CheckboxWrapper({
  task,
  memberId,
  onStatusChange
}: CheckboxWrapperProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [checked, setChecked] = useState(task.status === 'COMPLETED');

  const handleCheckboxChange = useCallback(
    async (nextChecked: boolean) => {
      if (isUpdating) return;

      const newStatus = nextChecked ? 'COMPLETED' : 'PENDING';
      setChecked(nextChecked);

      try {
        setIsUpdating(true);
        const res = await updateTaskCompletion({
          taskId: task.taskId,
          status: newStatus,
          date: getTodayString()
        });

        if (res.newTitles.length > 0) {
          await Promise.all(
            res.newTitles.map(title =>
              createNotification({
                memberId,
                message: `칭호 "${title}"가 해금되었어요!`,
                type: 'MESSAGE'
              })
            )
          );
        }

        onStatusChange(task.taskId, newStatus);
      } catch (err) {
        console.error('태스크 상태 업데이트 실패:', err);
        setChecked(!nextChecked);
      } finally {
        setIsUpdating(false);
      }
    },
    [isUpdating, memberId, onStatusChange, task.taskId]
  );

  return (
    <Checkbox
      label={task.title}
      checked={checked}
      onChange={handleCheckboxChange}
      disabled={isUpdating}
    />
  );
}
