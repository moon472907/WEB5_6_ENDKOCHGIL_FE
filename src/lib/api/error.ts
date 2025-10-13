import { redirect } from "next/navigation";

/**
 * 공통 인증 에러 핸들러
 * - 401 → 로그인 리디렉션
 * - 기타 에러 로깅 후 Error throw
 */
export async function handleAuthError(res: Response, context?: string) {
  if (res.status === 401) {
    console.warn('accessToken 만료됨');
    redirect('/login');
  }

  const errorText = await res.text().catch(() => '');
  console.error(`❌ ${context || 'API'} 실패`, res.status, res.statusText, errorText);

  throw new Error(
    `${context || 'API 요청 실패'}: ${res.status} ${res.statusText} ${errorText}`
  );
}