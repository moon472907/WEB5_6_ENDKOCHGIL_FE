'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getMissionDetail } from '@/lib/api/mission/mission';
import Loading from '@/components/loading/Loading';
import { MissionResponse } from '@/types/mission';
import MissionDetailView from './MissionDetailView';

export default function MissionLoader() {
  const { id } = useParams();
  const [mission, setMission] = useState<MissionResponse['content'] | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchMission = async () => {
      try {
        setLoading(true);
        const response = await getMissionDetail(Number(id));
        setMission(response.content);
      } catch (err) {
        console.error('미션 상세 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMission();
  }, [id]);

  if (loading) return <Loading text="미션을 불러오고 있어요" />;
  if (!mission)
    return <div className="text-gray-500 text-center mt-10">데이터 없음</div>;

  return <MissionDetailView mission={mission} />;
}
