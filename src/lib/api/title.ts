import { BASE_URL } from "@/lib/api/config";

// API 응답 타입 정의
interface TitleResponse {
  id: number;
  contents: string;
  achiveRequire: string;
  caption: string;
}

// 클라이언트에서 쓸 구조
export interface Title {
  id: number;
  name: string;
  condition: string;
  description: string;
}

// 전체 칭호 조회
export async function getAllTitles(accessToken: string): Promise<Title[]> {
  const res = await fetch(`${BASE_URL}/api/v1/title`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: `accessToken=${accessToken}`,
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("칭호 전체 조회 실패");

  const data: {
    success: boolean;
    code: string;
    message: string;
    content: TitleResponse[];
  } = await res.json();

  return data.content.map((t) => ({
    id: t.id,
    name: t.contents,
    condition: t.achiveRequire,
    description: t.caption,
  }));
}

// 보유한 칭호 조회
export async function getMyTitles(accessToken: string): Promise<number[]> {
  const res = await fetch(`${BASE_URL}/api/v1/members/me/titles`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: `accessToken=${accessToken}`,
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("보유한 칭호 조회 실패");

  const data: {
    success: boolean;
    code: string;
    message: string;
    content: { titles: number[] };
  } = await res.json();

  return data.content.titles;
}

// 칭호 장착
export async function equipTitle(
  accessToken: string,
  id: number
): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/v1/members/equip/title/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: `accessToken=${accessToken}`,
    },
    credentials: "include",
  });

  if (!res.ok) throw new Error("칭호 장착 실패");
}

// 칭호 장착 해제
export async function unequipTitle(accessToken: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/v1/members/unequip/title`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: `accessToken=${accessToken}`,
    },
    credentials: "include",
  });

  if (!res.ok) throw new Error("칭호 장착 해제 실패");
}