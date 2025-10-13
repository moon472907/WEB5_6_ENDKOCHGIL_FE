import { cookies } from 'next/headers';
import { redirect } from "next/navigation";
import { getMyInfo } from '@/lib/api/member';
import ShopClient from './components/ShopClient';

export default async function Page() {
  try {
    const cookieStore = cookies();
    const accessToken = (await cookieStore).get('accessToken')?.value;

    if (!accessToken) redirect("/login");

    const profile = await getMyInfo(accessToken);

    return <ShopClient coin={profile.money} />;
  } catch (err) {
    console.error("회원 정보 로드 중 오류 발생:", err);
    redirect("/login");
  }
}