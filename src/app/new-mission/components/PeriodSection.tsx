'use client';

import FormSection from './FormSection';
import CustomSelectBox from './CustomSelectBox';
import { MdCalendarMonth } from 'react-icons/md';
import { maxPeriodOptions } from '@/constants/missionOptions';

interface PeriodSectionProps {
  periodWeeks: number | null;
  onChange: (v: number | null) => void;
}

export default function PeriodSection({
  periodWeeks,
  onChange
}: PeriodSectionProps) {
  return (
    <FormSection
      icon={<MdCalendarMonth size={20} className="text-button-point" />}
      alt="기간"
      label="기간"
      tooltip={
        <>
          기간은 1주일 단위로 설정할 수 있어요
        </>
      }
    >
      <CustomSelectBox
        options={maxPeriodOptions}
        value={periodWeeks}
        onChange={onChange}
        placeholder="미션 기간을 선택해주세요"
      />
    </FormSection>
  );
}
