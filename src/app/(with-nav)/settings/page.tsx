import { getMyInfo } from '@/lib/api/member';
import SettingsClient from './components/SettingsClient';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '설정 - NuTree',
  description: '나의 정보를 확인하고 설정을 관리해보세요.'
};

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    redirect("/login");
  }

  const profile = await getMyInfo(accessToken);

  if (!profile) {
    redirect('/login');
  }

  return <SettingsClient profile={profile} />;
}
