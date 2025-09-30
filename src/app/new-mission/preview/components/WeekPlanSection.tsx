import DayPlanItem from "@/components/ui/DayPlanItem";

interface WeekPlanSectionProps {
  weekLabel: string;
  plans: string[];
}

export default function WeekPlanSection({ weekLabel, plans }: WeekPlanSectionProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-gray-09 font-bold text-lg">{weekLabel}</p>
      <div className="flex flex-col gap-2">
        {plans.map((title, idx) => (
          <DayPlanItem key={idx} day={idx + 1} title={title} variant="next" />
        ))}
      </div>
    </div>
  );
}
