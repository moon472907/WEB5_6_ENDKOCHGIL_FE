export async function setDevTime(date: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL_DEV}/api/v1/dev/time/set?date=${date}`,
    {
      method: 'POST',
      credentials: 'include',
    }
  );

  if (!res.ok) {
    throw new Error(`시간 고정 실패: ${res.statusText}`);
  }

  // console.log(`시스템 시간이 ${date}로 설정되었습니다.`);
}