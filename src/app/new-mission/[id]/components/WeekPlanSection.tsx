import DayPlanItem from '@/components/ui/DayPlanItem';

interface WeekPlanSectionProps {
  weekLabel: string;
  subGoalId: number;
  plans: { taskId: number; title: string }[];
  onTaskEdit: (nextTitle: string, taskId: number, subGoalId: number) => void;
}

export default function WeekPlanSection({
  weekLabel,
  subGoalId,
  plans,
  onTaskEdit
}: WeekPlanSectionProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-gray-09 font-bold text-lg">{weekLabel}</p>
      <ul className="flex flex-col gap-2">
        {plans.map((task, idx) => (
          <DayPlanItem
            key={task.taskId}
            day={idx + 1}
            title={task.title}
            variant="next"
            taskId={task.taskId}
            subGoalId={subGoalId}
            onSave={onTaskEdit}
          />
        ))}
      </ul>
    </div>
  );
}
