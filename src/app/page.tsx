import { cookies } from 'next/headers';
import { getTodayTask } from '@/lib/api/home/task';
import { getMyInfo } from '@/lib/api/member';
import { setDevTime } from '@/lib/api/home/devTime';
import { redirect } from 'next/navigation';
import HomeClientWrapper from './home/components/HomeClientWrapper';

export default async function Home() {
  const cookieStore = cookies();
  const accessToken = (await cookieStore).get('accessToken')?.value;
  console.log('[SSR] accessToken =', accessToken);
  try {
    if (process.env.NODE_ENV === 'development') {
      await setDevTime('2025-10-13');
    }

    const tasks = await getTodayTask(accessToken);
    const profile = await getMyInfo(accessToken);

    return (
      <HomeClientWrapper
        initialTasks={tasks}
        initialProfile={profile}
        accessToken={accessToken}
      />
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      redirect('/login');
    }
    console.error('홈 렌더링 중 오류 발생:', error);
    throw error;
  }
}
