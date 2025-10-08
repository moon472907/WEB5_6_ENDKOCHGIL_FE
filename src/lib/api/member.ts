import { BASE_URL } from '@/lib/api/config';

export async function putProfile(payload: {
  name: string;
  birth: string;
  gender: 'MALE' | 'FEMALE';
}) {
  const res = await fetch(
    `${BASE_URL}/api/v1/members/valid`,
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
    `${BASE_URL}/api/v1/members/valid`,
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


// 프로필 수정
export async function updateProfile(payload: {
  name: string;
  birth: string;
  gender: 'MALE' | 'FEMALE';
}) {
  const res = await fetch(`${BASE_URL}/api/v1/members/modify/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error('프로필 수정 실패');
  return res.json();
}


// 회원 정보 확인
export async function getMyInfo(accessToken: string | undefined) {
  try {
    const res = await fetch(
      `${BASE_URL}/api/v1/members/me`,
      {
        method: 'GET',
        headers: {
          Cookie: `accessToken=${accessToken}`,
        },
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      console.warn('내 정보 조회 실패:', res.status);
      return null;
    }

    const data = await res.json();
    return data.content;
  } catch (error) {
    console.error('내 정보 조회 중 에러:', error)
    return null;
  }
}


// 로그아웃
export async function logout() {
  try {
    const res = await fetch(
      `${BASE_URL}/api/v1/members/logout`,
      {
        method: 'DELETE',
        credentials: 'include',
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      console.warn('로그아웃 실패:', res.status);
      return false;
    }

    const data = await res.json();
    console.log('로그아웃 성공:', data);
    return true;
  } catch (error) {
    console.error('로그아웃 요청 중 에러:', error);
    return false;
  }
}


// 회원 탈퇴
export async function unregister() {
  try {
    const res = await fetch(
      `${BASE_URL}/api/v1/members/delete`,
      {
        method: 'DELETE',
        credentials: 'include',
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      console.warn('회원 탈퇴 실패:', res.status);
      return false;
    }

    const data = await res.json();
    console.log('회원 탈퇴 성공:', data);
    return true;
  } catch (error) {
    console.error('회원 탈퇴 요청 중 에러:', error);
    return false;
  }
}