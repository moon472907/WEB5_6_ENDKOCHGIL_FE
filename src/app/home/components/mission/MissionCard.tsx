import { Task } from '@/app/home/types/task';
import CheckboxWrapper from './CheckboxWrapper';
import { MdPerson } from 'react-icons/md';

interface MissionCardProps {
  task: Task;
  memberId: number;
  onStatusChange: (taskId: number, newStatus: 'PENDING' | 'COMPLETED') => void;
}

export default function MissionCard({
  task,
  memberId,
  onStatusChange
}: MissionCardProps) {
  const isSoloMission = !task.partyCompletion;
  // console.log("isSoloMission = ", isSoloMission);
  
  const completedMembers = isSoloMission
    ? task.status === 'COMPLETED'
      ? 1
      : 0
    : task.partyCompletion.completedMembers;

  const totalMembers = isSoloMission ? 1 : task.partyCompletion.totalMembers;

  return (
    <div className="flex flex-col gap-7 bg-white rounded-3xl shadow-md px-5 py-4">
      <div className="flex flex-col gap-3">
        <p className="font-semibold text-gray-09">{task.missionTitle}</p>
        <div className="flex gap-1">
          <MdPerson size={20} className="text-[#434343]" />
          <p className="text-sm font-medium text-gray-04">
            {completedMembers}/{totalMembers}명 참가중
          </p>
        </div>
      </div>

      <CheckboxWrapper
        task={task}
        memberId={memberId}
        onStatusChange={onStatusChange}
      />
    </div>
  );
}
