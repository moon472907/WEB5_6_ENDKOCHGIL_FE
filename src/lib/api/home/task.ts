import {
  Task,
  TaskCompletion,
  UpdateTaskCompletionBody
} from '@/app/home/types/task';
import { BASE_URL } from '../config';
import { handleAuthError } from '../error';

/**
 * 오늘의 테스크 리스트 조회 API
 * @param accessToken
 * @returns 오늘의 태스크 리스트 Task[]
 */
export async function getTodayTask(accessToken?: string): Promise<Task[]> {
  const isServer = typeof window === 'undefined';

  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };

  // 서버 환경일 경우 수동으로 쿠키 설정
  if (isServer) {
    if (!accessToken) {
      console.warn('accessToken 없음');
      throw new Error('UNAUTHORIZED');
    }
    headers['Cookie'] = `accessToken=${accessToken}`;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/v1/tasks/today`, {
      method: 'GET',
      cache: 'no-store',
      credentials: 'include',
      headers
    });

    if (!res.ok) {
      await handleAuthError(res, '오늘의 테스크 리스트 조회 실패');
      throw new Error('API_ERROR');
    }

    const data = await res.json();
    // console.log('오늘의 테스크 = ', data);
    return data?.content ?? [];
  } catch (error) {
    console.error('[getTodayTask] 서버 오류:', error);
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      throw error;
    }
    throw new Error('API_ERROR');
  }
}

/**
 * 오늘의 테스크 완료 상태 단건 업데이트 API
 * @param UpdateTaskCompletionBody
 * @returns TaskCompletion
 */
export async function updateTaskCompletion(
  body: UpdateTaskCompletionBody
): Promise<TaskCompletion> {
  const res = await fetch(`${BASE_URL}/api/v1/tasks/complete`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    await handleAuthError(res, '테스크 완료 상태 업데이트 실패');
  }

  const data = await res.json();
  // console.log(' 테스크 완료 res ', data);

  return data.content;
}
