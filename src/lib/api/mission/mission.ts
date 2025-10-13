import { CreateMissionRequest, MissionResponse } from '@/types/mission';
import { BASE_URL } from '../config';
import { handleAuthError } from '../error';

/**
 * 미션 생성 API
 * @param CreateMissionRequest
 * @returns MissionResponse
 */
export async function createMission(
  data: CreateMissionRequest
): Promise<MissionResponse> {
  console.log('data = :', JSON.stringify(data));

  const res = await fetch(`${BASE_URL}/api/v1/missions`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  console.log('미션 생성 res', res);

  if (!res.ok) {
    await handleAuthError(res, '미션 생성 실패');
  }
  return res.json();
}

/**
 * 미션 상세 조회 API
 * @param missionId number
 * @returns MissionResponse
 */
export async function getMissionDetail(
  missionId: number
): Promise<MissionResponse> {
  const res = await fetch(`${BASE_URL}/api/v1/missions/${missionId}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    await handleAuthError(res, '미션 상세 조회 실패');
  }

  return res.json();
}

/**
 * 주차별 Task 수정 API
 * @param subGoalId 주차(subGoal) ID
 * @param tasks 수정할 Task 리스트 [{ taskId, title }]
 */
export async function updateWeekTasks(
  subGoalId: number,
  tasks: { taskId: number; title: string }[]
): Promise<void> {
  const payload = { subGoalId, tasks };

  const res = await fetch(`${BASE_URL}/api/v1/tasks/week`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    await handleAuthError(res, '주차별 task 수정 실패');
  }

  console.log('Task 수정 완료');
}
