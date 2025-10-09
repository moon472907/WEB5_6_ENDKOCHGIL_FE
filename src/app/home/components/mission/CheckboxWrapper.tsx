'use client';

import { Task } from '@/app/home/types/task';
import Checkbox from './Checkbox';
import { updateTaskCompletion } from '@/lib/api/home/task';
import { getTodayString } from '@/utils/date';

interface CheckboxWrapperProps {
  task: Task;
  onStatusChange?: (taskId: number, newStatus: 'PENDING' | 'COMPLETED') => void;
}

export default function CheckboxWrapper({
  task,
  onStatusChange
}: CheckboxWrapperProps) {
  const isCompleted = task.status === 'COMPLETED';

  const handleCheckboxChange = async (checked: boolean) => {
    try {
      const newStatus = checked ? 'COMPLETED' : 'PENDING';
      await updateTaskCompletion({
        taskId: task.taskId,
        status: newStatus,
        date: getTodayString()
      });

      console.log(`Task ${task.taskId} 상태가 ${newStatus}로 변경됨`);
      onStatusChange?.(task.taskId, newStatus);
      
      // TODO: 경험치, 코인, 칭호 관련 API 호출도 여기서 이어서 실행
    } catch (err) {
      console.error('태스크 상태 업데이트 실패', err);
    }
  };

  return (
    <>
      <Checkbox
        label={task.title}
        defaultChecked={isCompleted}
        onChange={handleCheckboxChange}
      />
    </>
  );
}
