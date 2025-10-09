import { cookies } from 'next/headers';
import Nav from '@/components/nav/Nav';
import HeaderSection from './home/components/HeaderSection';
import CharacterSection from './home/components/CharacterSection';
import MissionListSection from './home/components/MissionListSection';
import { getTodayTask } from '@/lib/api/home/task';
import { getMyInfo } from '@/lib/api/member';

export default async function Home() {
  const cookieStore = cookies();
  const accessToken = (await cookieStore).get('accessToken')?.value;
  const tasks = await getTodayTask(accessToken);
  const profile = await getMyInfo(accessToken);

  return (
    <div className="flex flex-col min-h-dvh pb-20">
      <HeaderSection profile={profile} accessToken={accessToken} />
      <CharacterSection />
      <MissionListSection tasks={tasks} />
      <Nav />
    </div>
  );
}
