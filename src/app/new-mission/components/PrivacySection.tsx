'use client';

import FormSection from './FormSection';
import Toggle from '@/components/ui/Toggle';
import { MdLockOutline } from 'react-icons/md';

interface PrivacySectionProps {
  isPublic: boolean;
  onChange: (v: boolean) => void;
}

export default function PrivacySection({
  isPublic,
  onChange
}: PrivacySectionProps) {
  return (
    <section className="flex flex-col gap-5 mt-auto mb-10">
      <FormSection
        icon={<MdLockOutline size={20} className="text-button-point" />}
        alt="공개 여부"
        label="공개 여부"
        tooltip={
          <>
            비공개 설정 시
            <br />
            파티 모집에 등록되지 않습니다
          </>
        }
        rightElement={<Toggle checked={isPublic} onChange={onChange} />}
      />
    </section>
  );
}
