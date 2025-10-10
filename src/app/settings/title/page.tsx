import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAllTitles, getMyTitles } from "@/lib/api/title";
import { getMyInfo } from "@/lib/api/member";
import TitleClient from "./components/TitleClient";

export default async function TitlePage() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) redirect("/login");

    const profile = await getMyInfo(accessToken);
    const allTitles = await getAllTitles(accessToken);
    const myTitleIds = await getMyTitles(accessToken);

    // 보유 여부 추가
    const mergedTitles = allTitles.map((title) => ({
      ...title,
      locked: !myTitleIds.includes(title.id),
    }));

    return (
      <TitleClient
        currentTitle={profile.title}
        allTitles={mergedTitles}
        accessToken={accessToken}
      />
    );
  } catch (err) {
     console.error("칭호 페이지 로드 중 오류 발생:", err);
     redirect("/login");
  }
}