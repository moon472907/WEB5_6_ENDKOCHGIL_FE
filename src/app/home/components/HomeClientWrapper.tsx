'use client';

import { useState } from 'react';
import Nav from '@/components/nav/Nav';
import HeaderSection from './HeaderSection';
import CharacterSection from './CharacterSection';
import MissionListSection from './MissionListSection';
import { getTodayTask } from '@/lib/api/home/task';
import { getMyInfo } from '@/lib/api/member';
import { Task } from '../types/task';
import { UserProfile } from '@/types/profile';

interface HomeClientWrapperProps {
  initialTasks: Task[];
  initialProfile: UserProfile;
  accessToken?: string;
}

export default function HomeClientWrapper({
  initialTasks,
  initialProfile,
  accessToken
}: HomeClientWrapperProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [profile, setProfile] = useState(initialProfile);

  // tasks와 profile을 다시 가져오기
  const refreshData = async () => {
    try {
      const [updatedTasks, updatedProfile] = await Promise.all([
        getTodayTask(),
        getMyInfo(accessToken)
      ]);
      setTasks(updatedTasks);
      setProfile(updatedProfile);
      // console.log("updatedTasks - ", updatedTasks);
      // console.log("updatedProfile - ", updatedProfile);
    } catch (err) {
      console.error('데이터 새로고침 실패:', err);
    }
  };

  const equippedItemImg = profile?.item ?? null;

  return (
    <div className="flex flex-col min-h-dvh pb-20">
      <HeaderSection profile={profile} accessToken={accessToken} />
      <CharacterSection equippedItemImg={equippedItemImg} />
      <MissionListSection
        memberId={profile.id}
        initialTasks={tasks}
        onRefreshData={refreshData}
      />
      <Nav />
    </div>
  );
}
