'use client';

import FormSection from './FormSection';
import GoalInput from './GoalInput';
import { TbTarget } from 'react-icons/tb';

interface GoalSectionProps {
  goal: string;
  onChange: (v: string) => void;
}

export default function GoalSection({ goal, onChange }: GoalSectionProps) {
  return (
    <FormSection
      icon={<TbTarget size={20} className="text-button-point" />}
      alt="목표 설정"
      label="목표 설정"
    >
      <GoalInput value={goal} onChange={onChange} />
    </FormSection>
  );
}
