import { MdLockOutline } from "react-icons/md";

interface LockPlanItemProps {
  label: string;
}

export default function LockPlanItem({ label }: LockPlanItemProps) {
  return (
    <div className="flex items-center justify-between w-full px-4 py-3 border border-border-card-disabled rounded-xl">
      <span className="text-gray-04 font-semibold">
        {label}
      </span>
      <MdLockOutline className="text-gray-04 w-6 h-6" />
    </div>
  );
}
