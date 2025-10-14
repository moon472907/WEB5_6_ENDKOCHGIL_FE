import PartyPlanInner from '@/app/partyplan/Inner/PartyPlanInner';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: '파티 계획 - NuTree',
  description: '참여할 파티의 미션 계획을 미리 확인해보세요.'
};

export default function Page() {
  return (
    <Suspense fallback={<div className="p-4 text-text-sub">로딩 중...</div>}>
      <PartyPlanInner />
    </Suspense>
  );
}
