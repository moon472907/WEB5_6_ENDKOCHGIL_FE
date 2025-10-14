/**
 * 공통 인증 에러 핸들러
 * - 401 → 로그인 리디렉션
 * - 기타 에러 로깅 후 Error throw
 */
export async function handleAuthError(res: Response, context?: string) {
  if (res.status === 401) {
    console.warn('accessToken 만료됨');
    throw new Error('UNAUTHORIZED');
  }

  let errorMessage = `${context || "API 요청 실패"}: ${res.status}`;

  try {
    // JSON 응답이라면 message 필드만 추출
    const errorData = await res.json();
    if (errorData?.message) {
      errorMessage = errorData.message;
    } else {
      errorMessage = JSON.stringify(errorData);
    }
  } catch {
    // JSON 파싱 실패 시 fallback
    const errorText = await res.text().catch(() => "");
    errorMessage += ` ${errorText}`;
  }

  console.error(`${context || "API"} 실패`, res.status, res.statusText, errorMessage);

  throw new Error(errorMessage);
}