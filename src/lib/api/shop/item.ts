import { BASE_URL } from '@/lib/api/config';

export type ItemType =
  | 'CHARACTER'
  | 'DEFAULT'
  | 'FESTIVAL'
  | 'NATURE'
  | 'SPECIAL'
  | 'SPORTS';

export interface Item {
  id: number;
  name: string;
  img: string;
  itemType: ItemType;
  price: number;
  owned: boolean;
}

// 전체 아이템 조회
export async function getAllItems(accessToken: string) {
  const res = await fetch(`${BASE_URL}/api/v1/item`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `accessToken=${accessToken}`
    },
    cache: 'no-store'
  });

  if (!res.ok) throw new Error('전체 아이템 조회 실패');

  const data = await res.json();
  return data.content as Omit<Item, 'owned'>[];
}

// 보유 아이템 조회
export async function getOwnedItemIds(accessToken: string) {
  const res = await fetch(`${BASE_URL}/api/v1/members/me/items`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `accessToken=${accessToken}`
    },
    cache: 'no-store'
  });

  if (!res.ok) throw new Error('보유 아이템 조회 실패');

  const data = await res.json();
  const itemsObj = data.content?.items ?? {};

  // 모든 카테고리의 id 배열을 평탄화
  const ownedIds: number[] = Object.values(itemsObj).flat() as number[];

  return ownedIds;
}


// 아이템 장착 해제
export async function unequipTitle(accessToken: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/v1/members/unequip/item`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: `accessToken=${accessToken}`,
    },
    credentials: "include",
  });

  if (!res.ok) throw new Error("아이템 장착 해제 실패");
}