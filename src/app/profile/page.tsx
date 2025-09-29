import ProfileForm from '@/components/profile/ProfileForm';
import { getProfile } from '@/lib/api/member';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Page() {
  const cookieStore = cookies();
  const accessToken = (await cookieStore).get('accessToken')?.value;

  try {
    const data = await getProfile(accessToken);
    console.log('getProfile data', data);

    if (data.success && data.content.valid) {
      console.log('getProfile valid true! ');
      
      redirect('/');
    }
  } catch (error: unknown) {
    // TODO : alert? modal? toast?
    const e = error as Error;
  if (e.message === 'NEXT_REDIRECT') throw e;
  console.log('프로필 조회 에러 발생:', e.message);
  }

  return <ProfileForm />;
}
