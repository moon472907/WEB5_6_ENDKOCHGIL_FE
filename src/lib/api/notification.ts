import { CreateNotificationBody, Notification } from "@/types/notification";
import { BASE_URL } from "./config";
import { ApiResponse } from "@/@types/global";

/**
 * 전체 알림 조회 API
 * @param accessToken
 * @returns Promise<Notification[]>
 */
export async function getAllNotifications(accessToken?: string):Promise<ApiResponse<Notification[]>> {
  const res = await fetch(`${BASE_URL}/api/v1/notification`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Cookie: `accessToken=${accessToken}` } : {}),
    },
  });

  if (!res.ok) throw new Error('알림 조회 실패');
  return res.json();
}

/**
 * 알림 생성 API
 * @param body CreateNotificationBody - 생성할 알림 데이터
 * @param body.memberId number - 알림을 받을 회원의 ID
 * @param body.message string - 알림 내용
 * @param body.type string - 알림 유형
 * @returns ApiResponse<Notification>
 */
export async function createNotification(body: CreateNotificationBody):Promise<ApiResponse<Notification>> {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/notification`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => '');
      throw new Error(
        `알림 생성 실패: ${res.status} ${res.statusText} ${errorText}`
      );
    }

    const data = await res.json();
    console.log('[createNotification] success:', data);
    return data;
  } catch (err) {
    console.error('[createNotification] 요청 실패:', err);
    throw err;
  }
}

/**
 * 현재 로그인한 사용자의 알림 정보 조회 API (memberID를 얻기 위해 사용)
 * @param accessToken 인증 토큰
 * @returns ApiResponse<Notification[]> (사용자 본인의 알림 목록)
 */
export async function getMyNotificationInfo(accessToken?: string) {
  const res = await fetch(`${BASE_URL}/api/v1/notification/me`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Cookie: `accessToken=${accessToken}` } : {}),
    },
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    throw new Error(`내 알림 조회 실패: ${res.status} ${res.statusText} ${errorText}`);
  }

  return res.json();
}

/**
 * 알림 삭제 API
 * @param id Notification id
 * @returns ApiResponse (success 만 판단)
 */
export async function deleteNotification(id: number):Promise<ApiResponse<string>> {
  const res = await fetch(`${BASE_URL}/api/v1/notification/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    throw new Error(`알림 삭제 실패: ${res.status} ${res.statusText} ${errorText}`);
  }

  return res.json();
}

/**
 * 알림 읽음 처리 API
 * @param id Notification id
 * @returns ApiResponse<Notification>
 */
export async function readNotification(id: number) {
  const res = await fetch(`${BASE_URL}/api/v1/notification/read/${id}`, {
    method: 'PUT',
    credentials: 'include',
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    throw new Error(`알림 읽음 처리 실패: ${res.status} ${res.statusText} ${errorText}`);
  }

  return res.json();
}