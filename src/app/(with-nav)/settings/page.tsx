import { getMyInfo } from '@/lib/api/member';
import SettingsClient from './components/SettingsClient';
import { cookies } from 'next/headers';

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const data = await getMyInfo(accessToken);
  const profile = data.content;

  return <SettingsClient profile={profile} />;
}
