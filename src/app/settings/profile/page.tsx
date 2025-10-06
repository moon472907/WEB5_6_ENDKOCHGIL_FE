import ProfileForm from "@/components/profile/ProfileForm";
import { getMyInfo } from "@/lib/api/member";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const data = await getMyInfo(accessToken);
  const content = data?.content;

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