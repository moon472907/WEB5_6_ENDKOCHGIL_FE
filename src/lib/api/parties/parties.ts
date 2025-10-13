import { BASE_URL } from '../config';
import { getMyInfo } from '@/lib/api/member';

/**
 * PartyApiItem
 * - 백엔드에서 내려주는 파티 하나의 구조
 * - members 배열 안에는 각 멤버의 상태(status)가 포함됨
 */
export type PartyApiItem = {
  id: number;
  name: string;
  leaderId?: number;
  currentMembers?: number;
  maxMembers?: number;
  isPublic?: boolean; // 공개 여부 (진행 여부 아님)
  members?: {
    id?: number;
    email?: string;
    name?: string;
    status?: 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'LEFT';
  }[];
  missionId?: number;
  category?: 'EXERCISE' | 'LEARNING' | 'HABIT' | 'MENTAL' | 'CUSTOM' | string;
  startDate?: string;
  endDate?: string;
  createDate?: string;
  modifyDate?: string;
  missionTitle?: string; // 미션 제목
  views?: number;
};

export type PartiesPage = {
  totalElements: number;
  totalPages: number;
  size: number;
  content: PartyApiItem[];
  number: number;
};

/** ✅ BASE_URL 끝 / 중복 방지 */
function getBaseUrl(): string {
  return (BASE_URL ?? '').replace(/\/$/, '');
}

/** ✅ JSON 파싱 실패 시 null 반환 */
function safeJsonParse<T = unknown>(text: string): T | null {
  try {
    return text ? (JSON.parse(text) as T) : null;
  } catch {
    return null;
  }
}

type PartiesApiResponse =
  | { content: PartiesPage }
  | { content: PartyApiItem[] };

/**
 * 📡 파티 목록 조회 (프론트 클라이언트)
 */
export async function fetchPartiesClient(
  params: {
    page?: number;
    size?: number;
    sort?: string;
    category?: string;
    startDate?: string;
  } = {},
  signal?: AbortSignal
): Promise<{
  list: PartyApiItem[];
  pageMeta: PartiesPage | null;
  raw: PartiesApiResponse;
}> {
  const qs = new URLSearchParams();
  if (params.page !== undefined) qs.set('page', String(params.page));
  if (params.size !== undefined) qs.set('size', String(params.size));
  if (params.sort) qs.set('sort', params.sort);
  if (params.category) qs.set('category', params.category);
  if (params.startDate) qs.set('startDate', params.startDate);

  const base = getBaseUrl();
  const url = base
    ? `${base}/api/v1/parties?${qs.toString()}`
    : `/api/v1/parties?${qs.toString()}`;

  const res = await fetch(url, {
    credentials: 'include',
    headers: { Accept: 'application/json' },
    signal
  });
  const text = await res.text().catch(() => '');
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);

  const parsed = res.headers.get('content-type')?.includes('application/json')
    ? safeJsonParse<PartiesApiResponse>(text)
    : null;

  const raw: PartiesApiResponse = parsed ?? { content: [] };
  const list = Array.isArray(raw.content)
    ? (raw.content as PartyApiItem[])
    : raw.content.content;
  const pageMeta = Array.isArray(raw.content) ? null : raw.content;

  return { list, pageMeta, raw };
}

/**
 * ✅ 특정 파티 상세 조회
 */
export async function fetchPartyDetailClient(
  partyId: string | number
): Promise<PartyApiItem> {
  const url = `${BASE_URL}/api/v1/parties/${partyId}`;
  const res = await fetch(url, {
    credentials: 'include',
    headers: { Accept: 'application/json' }
  });
  if (!res.ok) throw new Error(`fetchPartyDetailClient: HTTP ${res.status}`);
  const json = await res.json();
  if (json && typeof json === 'object' && 'content' in json)
    return json.content as PartyApiItem;
  return json as PartyApiItem;
}

/**
 * ✅ 파티 참여 요청
 */
export async function joinPartyClient(partyId: string | number): Promise<void> {
  const url = `${BASE_URL}/api/v1/parties/${partyId}/join`;
  const res = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' }
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`joinPartyClient: HTTP ${res.status} ${text}`);
  }
}

/**
 * 특정 멤버 상태 업데이트 (예: 미션 완료 / LEFT)
 */
export async function updateMemberStatus(
  partyId: number | string,
  memberId: number | string,
  status: 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'LEFT'
): Promise<void> {
  const url = `${getBaseUrl()}/api/v1/party-members/${partyId}/members/${memberId}/status`;
  const res = await fetch(url, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`updateMemberStatus: HTTP ${res.status} ${text}`);
  }
}

/**
 * 내가 속한 파티 + 내 상태(myStatus) 계산 및 탭 필터
 */
export async function fetchMyPartiesWithStatus(
  filter: 'ongoing' | 'done' | 'all' = 'all'
): Promise<
  Array<
    PartyApiItem & {
      myStatus?: 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'LEFT';
      current?: number; // 진행률 % (0..100)
      max?: number;     // 항상 100 (퍼센트 기준)
    }
  >
> {
  const me = await getMyInfo(undefined);
  if (!me?.id) return [];

  let list: PartyApiItem[] = [];
  try {
    const resp = await fetchPartiesClient({ size: 200 });
    list = resp.list ?? [];
  } catch (err) {
    console.error('fetchPartiesClient 실패:', err);
    return [];
  }

  const myList = list.filter(party => {
    const isLeader = String(party.leaderId) === String(me.id);
    const isMember = (party.members ?? []).some(m => String(m?.id) === String(me.id));
    return isLeader || isMember;
  });

  const mapped = myList.map(party => {
    const myMember = (party.members ?? []).find(m => String(m?.id) === String(me.id));
    const myStatus = myMember?.status as
      | 'PENDING'
      | 'ACCEPTED'
      | 'COMPLETED'
      | 'LEFT'
      | undefined;
    return { ...party, myStatus };
  });

  // Mission 관련 최소 타입 (명시적, any 금지)
  type MissionTask = {
    taskId?: number;
    status?: string | null;
  };
  type MissionSubGoal = {
    tasks?: MissionTask[] | null;
    taskDtos?: MissionTask[] | null;
  };
  type MissionItem = {
    missionId?: number;
    partyId?: number | null;
    myProgressRate?: number | null;
    partyProgress?: { myProgress?: number | null } | null;
    subGoals?: MissionSubGoal[] | null;
    subGoalsDto?: MissionSubGoal[] | null;
    totalWeeks?: number | null;
  };

  // missions 안전 파싱
  let missions: MissionItem[] = [];
  try {
    const mRes = await fetch(`${BASE_URL}/api/v1/missions`, {
      credentials: 'include',
      headers: { Accept: 'application/json' }
    });
    if (mRes.ok) {
      const text = await mRes.text().catch(() => '');
      const parsed = safeJsonParse<Record<string, unknown>>(text);
      const content = parsed?.content;
      if (content && typeof content === 'object') {
        const contentObj = content as Record<string, unknown>;
        const activeVal = contentObj['activeMissions'];
        const completedVal = contentObj['completedMissions'];
        if (Array.isArray(activeVal)) {
          missions = missions.concat(activeVal as MissionItem[]);
        }
        if (Array.isArray(completedVal)) {
          missions = missions.concat(completedVal as MissionItem[]);
        }
        if (missions.length === 0 && Array.isArray(content)) {
          missions = content as MissionItem[];
        }
      }
    }
  } catch (err) {
    console.warn('missions 조회 실패:', err);
    missions = [];
  }

  // 각 파티에 대해 안전하게 current/max 계산 (객체 불변 방식)
  const enriched = mapped.map(p => {
    try {
      const mission = missions.find(m => m.partyId !== undefined && m.partyId !== null && String(m.partyId) === String(p.id));
      const DEFAULT_MAX = 100;

      if (mission) {
        // 1) 백엔드 퍼센트 우선 사용
        const pct = mission.myProgressRate ?? mission.partyProgress?.myProgress;
        if (typeof pct === 'number' && !Number.isNaN(pct)) {
          const current = Math.max(0, Math.min(100, Math.round(pct)));
          return { ...p, current, max: DEFAULT_MAX };
        }

        // 2) subGoals.tasks가 있으면 태스크 수 기반 계산
        const subGoals = mission.subGoals ?? mission.subGoalsDto ?? [];
        if (Array.isArray(subGoals) && subGoals.length > 0) {
          let totalTasks = 0;
          let completedTasks = 0;
          for (const sg of subGoals) {
            const tasks = sg.tasks ?? sg.taskDtos ?? [];
            if (!Array.isArray(tasks) || tasks.length === 0) continue;
            totalTasks += tasks.length;
            completedTasks += tasks.filter(t => String((t.status ?? 'PENDING')).toUpperCase() === 'COMPLETED').length;
          }
          totalTasks = Math.max(7, Math.min(28, totalTasks || 7));
          const percent = Math.round((completedTasks / totalTasks) * 100);
          const current = Math.max(0, Math.min(100, percent));
          return { ...p, current, max: DEFAULT_MAX };
        }

        // 3) totalWeeks로 추정 가능하면 폴백(현재 0%)
        const weeks = Number(mission.totalWeeks ?? 0) || 0;
        if (weeks > 0) {
          return { ...p, current: 0, max: DEFAULT_MAX };
        }
      }
    } catch (err) {
      console.warn('파티 보정 중 오류', p.id, err);
    }

    // 최종 폴백: 0%
    return { ...p, current: 0, max: 100 };
  });

  if (filter === 'all') return enriched;
  if (filter === 'ongoing') return enriched.filter(p => p.myStatus === 'ACCEPTED');
  return enriched.filter(p => p.myStatus === 'COMPLETED' || p.myStatus === 'LEFT');
}
