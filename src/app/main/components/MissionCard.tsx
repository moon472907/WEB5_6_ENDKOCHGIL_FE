import { Task } from '@/app/main/types/task';
import CheckboxWrapper from './CheckboxWrapper';
import { MdPerson } from 'react-icons/md';

interface MissionCardProps {
  task: Task;
}

export default function MissionCard({ task }: MissionCardProps) {
  return (
    <div className="flex flex-col gap-7 bg-white rounded-3xl shadow-md px-5 py-4">
      <div className="flex flex-col gap-3">
        <p className="font-semibold text-gray-09">{task.title}</p>
        <div className="flex gap-1">
          <MdPerson size={20} className="text-[#434343]" />
          <p className="text-sm font-medium text-gray-04">
            {task.dayNum}명 참가중
          </p>
        </div>
      </div>

      <CheckboxWrapper task={task} />
    </div>
  );
}
