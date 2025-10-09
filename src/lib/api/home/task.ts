import { Task, TaskCompletion, UpdateTaskCompletionBody } from '@/app/home/types/task';
import { redirect } from 'next/navigation';
import { BASE_URL } from '../config';


// 개발 환경 여부 판단
const IS_DEV = process.env.NODE_ENV === 'development';

/**
 * 오늘의 테스크 리스트 조회 API
 * @param accessToken
 * @returns 오늘의 태스크 리스트 Task[]
 */
export async function getTodayTask(
  accessToken: string | undefined
): Promise<Task[]> {
  try {
    if (!accessToken) {
      console.warn('accessToken 없음');
      redirect('/login');
    }

    const res = await fetch(`${BASE_URL}/api/v1/tasks/today`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        Cookie: `accessToken=${accessToken}`
      }
    });

    if (IS_DEV) {
      console.log('[getTodayTask] 요청 URL:', res.url);
      console.log('[getTodayTask] 응답 상태:', res.status, res.statusText);
    }

    if (!res.ok) {
      const errorText = await res.text().catch(() => '');
      if (IS_DEV) {
        console.error('[getTodayTask] 서버 에러 응답:', errorText);
      }

      throw new Error(
        `오늘의 테스크 조회 실패: ${res.status} ${res.statusText}`
      );
    }

    const data = await res.json();

    if (IS_DEV) {
      console.log('[getTodayTask] 응답 데이터:', data);
    }

    return data.content;
  } catch (err) {
    if (IS_DEV) {
      console.error('[getTodayTask] 요청 중 예외 발생:', err);
    }
    throw err;
  }
}

/**
 * 오늘의 테스크 완료 상태 단건 업데이트 API
 * @param UpdateTaskCompletionBody
 * @returns TaskCompletion
 */
export async function updateTaskCompletion(body: UpdateTaskCompletionBody):Promise<TaskCompletion> {
  try {
    if (IS_DEV) {
      console.log('[updateTaskCompletion] 요청 body:', body);
    }

    const res = await fetch(`${BASE_URL}/api/v1/tasks/complete`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (IS_DEV) {
      console.log(
        '[updateTaskCompletion] 응답 상태:',
        res.status,
        res.statusText
      );
    }

    if (!res.ok) {
      const errorText = await res.text().catch(() => '');
      if (IS_DEV) {
        console.error('[updateTaskCompletion] 서버 응답 에러:', {
          status: res.status,
          statusText: res.statusText,
          errorBody: errorText
        });
      }
      throw new Error(
        `태스크 완료 상태 업데이트 실패 (${res.status} ${res.statusText})`
      );
    }

    const data: { success: boolean; content: TaskCompletion } = await res.json();

    if (IS_DEV) {
      console.log('[updateTaskCompletion] 성공 응답:', data);
    }

    return data.content;
  } catch (err) {
    if (IS_DEV) {
      console.error('[updateTaskCompletion] 요청 실패:', err);
    }
    throw err;
  }
}
