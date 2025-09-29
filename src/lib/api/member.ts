export async function putProfile(payload: {
  name: string;
  birth: string;
  gender: 'MALE' | 'FEMALE';
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/members/valid`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    }
  );

  if (!res.ok) throw new Error('프로필 입력 실패');
  return res.json();
}


export async function getProfile(accessToken: string | undefined) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/members/valid`,
    // `/api/v1/members/valid`,
    {
      method: 'GET',
      cache: 'no-store',
            credentials: 'include',

      headers: {
        Cookie: `accessToken=${accessToken}`
      }
    }
  );

  console.log("프로필 조회 res", res);
  
  if (!res.ok) throw new Error('프로필 조회 실패');
  return res.json();
}
