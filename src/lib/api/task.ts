import { Task } from "@/app/main/types/task";
import { BASE_URL } from "./config";
import { redirect } from "next/navigation";

interface UpdateTaskCompletionBody {
  taskId: number;
  status: 'PENDING' | 'COMPLETED';
  date: string;
}


/**
 * 오늘의 테스크 리스트 조회 API
 * @returns 오늘의 태스크 리스트
 */
export async function getTodayTask(accessToken: string | undefined): Promise<Task[]> {
  if (!accessToken) {
    console.warn("accessToken 없음");
    redirect("/login");
  }

  const res = await fetch(
    `${BASE_URL}/api/v1/tasks/today`,
    {
      method: 'GET',
      cache: 'no-store',
      // credentials: 'include',
      headers: {
        Cookie: `accessToken=${accessToken}`
      }
    }
  );

  if (!res.ok) {
    console.warn("오늘의 테스크 조회 실패");
    redirect("/login");
  }

  const data = await res.json();
  return data.content; 
}

/**
 * 오늘의 테스크 완료 상태 단건 업데이트 API
 * @returns 업데이트된 Task 객체
 */
export async function updateTaskCompletion(body: UpdateTaskCompletionBody) {
  const res = await fetch(`${BASE_URL}/api/v1/tasks/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error('태스크 완료 상태 업데이트 실패');
  }

  const data: { success: boolean; content: Task } = await res.json();
  return data.content;
}