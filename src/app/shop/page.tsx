import { cookies } from 'next/headers';
import { redirect } from "next/navigation";
import { getMyInfo } from '@/lib/api/member';
import { getAllItems, getOwnedItemIds } from '@/lib/api/shop/item';
import ShopClient from './components/ShopClient';

export default async function Page() {
  try {
    const cookieStore = cookies();
    const accessToken = (await cookieStore).get('accessToken')?.value;

    if (!accessToken) redirect("/login");

    const [profile, allItems, ownedIds] = await Promise.all([
      getMyInfo(accessToken),
      getAllItems(accessToken),
      getOwnedItemIds(accessToken)
    ]);

    // 보유 여부 추가
    const mergedItems = allItems.map(item => ({
      ...item,
      owned: ownedIds.includes(item.id)
    }));

    const equippedItemImg = profile?.item ?? null;

    return <ShopClient coin={profile.money} initialItems={mergedItems} equippedItemImg={equippedItemImg} />;
  } catch (err) {
    console.error("회원 정보 로드 중 오류 발생:", err);
    redirect("/login");
  }
}