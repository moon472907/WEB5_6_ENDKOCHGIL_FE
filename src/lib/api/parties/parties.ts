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
  missionIsCompleted?: boolean;
  views?: number;

  /** 서버에서 제공되는 개인 진행률 (0..100) — optional */
  myProgressRate?: number;
};

export type PartiesPage = {
  totalElements: number;
  totalPages: number;
  size: number;
  content: PartyApiItem[];
  number: number;
};

function getBaseUrl(): string {
  return (BASE_URL ?? '').replace(/\/$/, '');
}

/** JSON 파싱 실패 시 null 반환 */
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
 *   파티 목록 조회 (프론트 클라이언트)
 * - 공개/비공개가 섞여 내려올 수 있음
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
 *   특정 파티 상세 조회
 * - getBaseUrl()로 정리
 */
export async function fetchPartyDetailClient(
  partyId: string | number
): Promise<PartyApiItem> {
  const url = `${getBaseUrl()}/api/v1/parties/${partyId}`;
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
 * 파티 참여 요청
 */
export async function joinPartyClient(partyId: string | number): Promise<void> {
  const url = `${getBaseUrl()}/api/v1/parties/${partyId}/join`;
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
      current?: number;
      max?: number;
    }
  >
> {
  type MyStatus = 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'LEFT';

  const me = await getMyInfo(undefined);
  if (!me?.id) return [];

  const isRecord = (v: unknown): v is Record<string, unknown> =>
    typeof v === 'object' && v !== null;

  const isPartyApiItem = (v: unknown): v is PartyApiItem => {
    if (!isRecord(v)) return false;
    const r = v as Record<string, unknown>;
    return typeof r.id === 'number' && typeof r.name === 'string';
  };

  // my-parties 우선 조회 시도를 위해 list 변수를 먼저 선언
  let list: PartyApiItem[] = [];

  try {
    const url = `${getBaseUrl()}/api/v1/my-parties?status=${filter}`;
    const res = await fetch(url, {
      credentials: 'include',
      headers: { Accept: 'application/json' }
    });
    if (res.ok) {
      const text = await res.text().catch(() => '');
      const parsed = safeJsonParse<Record<string, unknown>>(text);
      if (parsed && typeof parsed === 'object') {
        const content = parsed['content'];
        if (content && typeof content === 'object') {
          const inner = (content as Record<string, unknown>)['content'];
          if (Array.isArray(inner)) {
            const items = inner.filter(isPartyApiItem) as PartyApiItem[];
            if (items.length > 0) {
              list = items;
            }
          } else if (Array.isArray(content)) {
            const items = (content as unknown[]).filter(isPartyApiItem) as PartyApiItem[];
            if (items.length > 0) list = items;
          }
        } else if (Array.isArray(parsed)) {
          const items = parsed.filter(isPartyApiItem) as PartyApiItem[];
          if (items.length > 0) list = items;
        }
      }
    }
  } catch (e) {
    console.warn('my-parties endpoint not available, fallback', e);
  }

  // 1) my-parties에서 수신된 목록이 없으면 기존 fetchPartiesClient로 로드
  if (list.length === 0) {
    try {
      const resp = await fetchPartiesClient({ size: 200 });
      list = resp.list ?? [];
    } catch (err) {
      console.warn('fetchPartiesClient 실패:', err);
      list = [];
    }
  }

  // 2) missions 조회
  type MissionTask = { taskId?: number; status?: string | null };
  type MissionSubGoal = { tasks?: MissionTask[] | null; taskDtos?: MissionTask[] | null };
  type MissionItem = {
    missionId?: number;
    partyId?: number | null;
    myProgressRate?: number | null;
    partyProgress?: { myProgress?: number | null } | null;
    subGoals?: MissionSubGoal[] | null;
    subGoalsDto?: MissionSubGoal[] | null;
    totalWeeks?: number | null;
  };

  const isMissionItem = (v: unknown): v is MissionItem => {
    if (!isRecord(v)) return false;
    const r = v as Record<string, unknown>;
    return (
      (r.partyId === undefined || typeof r.partyId === 'number' || r.partyId === null) &&
      (r.missionId === undefined || typeof r.missionId === 'number')
    );
  };

  let missions: MissionItem[] = [];
  try {
    const mRes = await fetch(`${getBaseUrl()}/api/v1/missions`, {
      credentials: 'include',
      headers: { Accept: 'application/json' }
    });
    if (mRes.ok) {
      const text = await mRes.text().catch(() => '');
      const parsed = safeJsonParse<Record<string, unknown>>(text);
      if (parsed) {
        const content = parsed['content'];
        if (isRecord(content)) {
          const active = content['activeMissions'];
          const completed = content['completedMissions'];
          if (Array.isArray(active)) missions = missions.concat(active.filter(isMissionItem));
          if (Array.isArray(completed)) missions = missions.concat(completed.filter(isMissionItem));
          if (missions.length === 0 && Array.isArray(content)) missions = (content as unknown[]).filter(isMissionItem);
        } else if (Array.isArray(parsed)) {
          missions = parsed.filter(isMissionItem);
        }
      }
    }
  } catch (err) {
    console.warn('missions 조회 실패:', err);
    missions = [];
  }

  // 3) missions의 partyId를 상세 조회로 보강(비공개 포함)
  try {
    const missionPartyIds = new Set(
      missions
        .map(m => m.partyId)
        .filter((v): v is number => typeof v === 'number' && !Number.isNaN(v))
        .map(String)
    );
    const existingIds = new Set(list.map(p => String(p.id)));
    const missing = Array.from(missionPartyIds).filter(id => !existingIds.has(id));

    if (missing.length > 0) {
      const details = await Promise.all(
        missing.map(async id => {
          try {
            return await fetchPartyDetailClient(id);
          } catch (e) {
            console.warn('fetchPartyDetailClient 실패:', id, e);
            return null;
          }
        })
      );
      for (const d of details) {
        if (d && !existingIds.has(String(d.id))) {
          list.push(d);
          existingIds.add(String(d.id));
        }
      }
    }
  } catch (err) {
    console.warn('미션 기반 보강 중 오류:', err);
  }

  // 4) 내가 속한 파티만(리더이거나 멤버인 경우)
  const myList = list.filter(p => {
    const isLeader = String(p.leaderId) === String(me.id);
    const isMember = (p.members ?? []).some(m => String(m?.id) === String(me.id));
    return isLeader || isMember;
  });

  // 5) myStatus 매핑
  const mapped = myList.map(p => {
    const myMember = (p.members ?? []).find(m => String(m?.id) === String(me.id));
    const rawStatus = myMember?.status;
    const myStatus =
      rawStatus === 'PENDING' || rawStatus === 'ACCEPTED' || rawStatus === 'COMPLETED' || rawStatus === 'LEFT'
        ? (rawStatus as MyStatus)
        : undefined;
    return { ...p, myStatus };
  });

  // 6) 진행률
  const enriched = mapped.map(p => {
    const rate = Number(p.myProgressRate ?? 0);
    const safeRate = Number.isFinite(rate) ? Math.max(0, Math.min(100, Math.round(rate))) : 0;
    return { ...p, myProgressRate: safeRate, current: safeRate, max: 100 };
  });

  if (filter === 'all') return enriched;
  if (filter === 'ongoing') return enriched.filter(p => p.myStatus === 'ACCEPTED');
  return enriched.filter(p => p.myStatus === 'COMPLETED' || p.myStatus === 'LEFT');
}

/**
 * 파티 삭제 (관리자)
 */
export async function deletePartyClient(partyId: string | number): Promise<void> {
  const url = `${getBaseUrl()}/api/v1/parties/${partyId}`;
  const res = await fetch(url, {
    method: 'DELETE',
    credentials: 'include',
    headers: { Accept: 'application/json' }
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`deletePartyClient: HTTP ${res.status} ${text}`);
  }
}

/**
 * 파티 수정 (이름 / maxMembers / 공개 여부)
 */
export async function updatePartyClient(
  partyId: string | number,
  body: { name?: string; maxMembers?: number; isPublicStatus?: boolean }
): Promise<void> {
  const url = `${getBaseUrl()}/api/v1/parties/${partyId}`;
  const res = await fetch(url, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`updatePartyClient: HTTP ${res.status} ${text}`);
  }
}

/**
 * 파티 탈퇴 (회원)
 */
export async function leavePartyClient(partyId: string | number): Promise<void> {
  const url = `${getBaseUrl()}/api/v1/parties/${partyId}/leave`;
  const res = await fetch(url, {
    method: 'DELETE',
    credentials: 'include',
    headers: { Accept: 'application/json' }
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`leavePartyClient: HTTP ${res.status} ${text}`);
  }
}
