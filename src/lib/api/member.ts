export async function putProfile(payload: {
  name: string;
  birth: string;
  gender: 'MALE' | 'FEMALE';
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL_PROD}/api/v1/members/valid`,
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
    `${process.env.NEXT_PUBLIC_API_BASE_URL_PROD}/api/v1/members/valid`,
    {
      method: 'GET',
      cache: 'no-store',
      headers: {
        Cookie: `accessToken=${accessToken}`
      }
    }
  );

  console.log('프로필 조회 res', res);

  if (!res.ok) throw new Error('프로필 조회 실패');
  return res.json();
}

// 회원 정보 확인
export async function getMyInfo(accessToken: string | undefined) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL_PROD}/api/v1/members/me`,
    {
      method: 'GET',
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
      cache: 'no-store',
    }
  );

  if (!res.ok) throw new Error(`내 정보 조회 실패`);
  return res.json();
}