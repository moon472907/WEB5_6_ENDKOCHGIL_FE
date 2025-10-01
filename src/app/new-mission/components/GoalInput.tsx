'use client';

interface GoalInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function GoalInput({ value, onChange }: GoalInputProps) {
  return (
    <input
      type="text"
      placeholder="미션 목표를 설정하세요"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl p-3 bg-button-unselected focus:outline-none"
    />
  );
}