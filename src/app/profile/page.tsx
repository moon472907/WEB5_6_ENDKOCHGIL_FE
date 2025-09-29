import ProfileForm from '@/components/profile/ProfileForm';
import { redirect } from 'next/navigation';

export default async function Page() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/members/valid`,
    {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store'
    }
  );

  const data = await res.json();

  if (data.success && data.content.valid) {
    redirect('/');
  }

  return <ProfileForm />;
}
