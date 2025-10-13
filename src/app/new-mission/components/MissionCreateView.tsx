'use client';

import ContentWrapper from '@/components/layout/ContentWrapper';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createMission } from '@/lib/api/mission/mission';
import GoalSection from './GoalSection';
import MembersSection from './MembersSection';
import PeriodSection from './PeriodSection';
import PrivacySection from './PrivacySection';

interface MissionCreateViewProps {
  setLoading: (value: boolean) => void;
  onError: (message: string) => void;
}

export default function MissionCreateView({
  setLoading,
  onError
}: MissionCreateViewProps) {
  const [goal, setGoal] = useState('');
  const [periodWeeks, setPeriodWeeks] = useState<number | null>(null);
  const [maxMembers, setMaxMembers] = useState<number | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const router = useRouter();

  const isValid = !!goal && !!periodWeeks && !!maxMembers;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    try {
      const mission = await createMission({
        title: goal,
        type: 'AI',
        periodWeeks,
        maxMembers,
        isPublic
      });

      const missionId = mission.content.missionId;
      console.log('미션 생성 완료:', mission);
      router.push(`/new-mission/${missionId}`);
    } catch (error) {
      console.log("error ===", error);
      
      const message =
        error instanceof Error
          ? error.message
          : '알 수 없는 오류가 발생했습니다.';
      onError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header title="미션 생성" />
      <ContentWrapper padding="xl">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 gap-5 text-stone-800 font-semibold h-full"
        >
          <GoalSection goal={goal} onChange={setGoal} />
          <MembersSection maxMembers={maxMembers} onChange={setMaxMembers} />
          <PeriodSection periodWeeks={periodWeeks} onChange={setPeriodWeeks} />
          <PrivacySection isPublic={isPublic} onChange={setIsPublic} />

          <Button
            type="submit"
            variant="basic"
            size="lg"
            fullWidth
            disabled={!isValid}
            className="mb-10"
          >
            미션 생성
          </Button>
        </form>
      </ContentWrapper>
    </>
  );
}
