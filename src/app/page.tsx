import { cookies } from 'next/headers';
import Nav from '@/components/nav/Nav';
import HeaderSection from './home/components/HeaderSection';
import CharacterSection from './home/components/CharacterSection';
import MissionListSection from './home/components/MissionListSection';
import { getTodayTask } from '@/lib/api/home/task';
import { getMyInfo } from '@/lib/api/member';
import { setDevTime } from '@/lib/api/home/devTime';
import { redirect } from 'next/navigation';

export default async function Home() {
  const cookieStore = cookies();
  const accessToken = (await cookieStore).get('accessToken')?.value;

  try { 
    const tasks = await getTodayTask(accessToken);
    const profile = await getMyInfo(accessToken);
    
    if (process.env.NODE_ENV === 'development') {
      await setDevTime('2025-10-13');
    }

    const equippedItemImg = profile?.item ?? null;
    
    return (
      <div className="flex flex-col min-h-dvh pb-20">
        <HeaderSection profile={profile} accessToken={accessToken} />
        <CharacterSection equippedItemImg={equippedItemImg} />
        <MissionListSection tasks={tasks} />
        <Nav />
      </div>
    );
    
  } catch(error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      redirect('/login');
    }
    console.error('홈 렌더링 중 오류 발생:', error);
    throw error;
  }
}
