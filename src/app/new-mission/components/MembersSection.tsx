'use client';

import FormSection from './FormSection';
import CustomSelectBox from './CustomSelectBox';
import { MdGroup } from 'react-icons/md';
import { maxMembersOptions } from '@/constants/missionOptions';

interface MembersSectionProps {
  maxMembers: number | null;
  onChange: (v: number | null) => void;
}

export default function MembersSection({
  maxMembers,
  onChange
}: MembersSectionProps) {
  return (
    <FormSection
      icon={<MdGroup size={20} className="text-button-point" />}
      alt="최대 참여 인원"
      label="최대 참여 인원"
    >
      <CustomSelectBox
        options={maxMembersOptions}
        value={maxMembers}
        onChange={onChange}
        placeholder="최대 참여 인원수를 선택해주세요"
      />
    </FormSection>
  );
}
