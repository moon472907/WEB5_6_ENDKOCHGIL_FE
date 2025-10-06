import { getMyInfo } from '@/lib/api/member';
import SettingsClient from './components/SettingsClient';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    redirect("/login");
  }

  const data = await getMyInfo(accessToken);

  if (!data) {
    redirect('/login');
  }

  const profile = data.content;

  return <SettingsClient profile={profile} />;
}
