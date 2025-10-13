import { BASE_URL } from "../config";

export async function setDevTime(date: string) {
  try {
    const res = await fetch(
      `${BASE_URL}/api/v1/dev/time/set?date=${date}`,
      {
        method: 'POST',
        credentials: 'include',
      }
    );

    if (!res.ok) {
      console.warn(`[setDevTime] 시간 고정 실패: ${res.status} ${res.statusText}`);
      return false;
    }

    console.log(`시스템 시간이 ${date}로 설정되었습니다.`);
    return true;
  } catch (error) {
    console.error('[setDevTime] 서버 오류:', error);
    return false;
  }
}
