'use client';

import { useState } from 'react';
import Loading from '@/components/loading/Loading';
import MissionCreateView from './MissionCreateView';

export default function MissionCreateLoader() {
  const [loading, setLoading] = useState(false);

  if (loading) {
    return <Loading text="미션을 생성하고 있어요" />;
  }

  return <MissionCreateView setLoading={setLoading} />;
}
