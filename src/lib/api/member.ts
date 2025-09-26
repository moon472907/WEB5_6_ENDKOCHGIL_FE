export async function modifyProfile(payload: {
  name: string;
  birth: string;
  gender: 'MALE' | 'FEMALE';
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/members/modify/profile`,
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
