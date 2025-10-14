import ProfileForm from "@/components/profile/ProfileForm";
import { getMyInfo } from "@/lib/api/member";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "프로필 수정 - NuTree",
  description: "나의 정보를 수정하고 프로필을 업데이트해보세요."
};

export default async function Page() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const content = await getMyInfo(accessToken);

  const genderValue =
    content?.gender === "MALE"
      ? ("남성" as "남성" | "여성")
      : content?.gender === "FEMALE"
      ? ("여성" as "남성" | "여성")
      : null;

  const initialData = {
    nickname: content?.name ?? "",
    gender: genderValue,
    birth: {
      year: content?.birth?.slice(0, 4) ?? "",
      month: content?.birth?.slice(5, 7) ?? "",
      day: content?.birth?.slice(8, 10) ?? "",
    },
  };
  
  return <ProfileForm mode="edit" initialData={initialData} />
}