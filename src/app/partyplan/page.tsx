'use client';

import PartyPlanInner from '@/app/partyplan/Inner/PartyPlanInner';
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<div className="p-4 text-text-sub">로딩 중...</div>}>
      <PartyPlanInner />
    </Suspense>
  );
}
