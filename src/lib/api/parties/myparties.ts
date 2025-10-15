import { BASE_URL } from '../config';

export type MyStatus = 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'LEFT';

export type MyPartyItem = {
  id: number;
  name: string;
  leaderId?: number;
  currentMembers?: number;
  maxMembers?: number;
  isPublic?: boolean;
  members?: {
    id?: number;
    email?: string;
    name?: string;
    status?: MyStatus;
  }[];
  missionId?: number;
  category?: 'EXERCISE' | 'LEARNING' | 'HABIT' | 'MENTAL' | 'CUSTOM' | string;
  startDate?: string;
  endDate?: string;
  createDate?: string;
  views?: number;
  missionTitle?: string;
  missionIsCompleted?: boolean;
  myStatus: MyStatus;
  myProgressRate?: number;
  current?: number; // 0..100 (서버 값 복사)
  max?: number; // 100 고정
};

export type MyPartiesPage = {
  content: MyPartyItem[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
};

const VALID_STATUS = new Set(['ongoing', 'done', 'all'] as const);

export async function fetchMyPartiesServer(
  status: 'ongoing' | 'done' | 'all' = 'ongoing',
  params: { page?: number; size?: number; sort?: string } = {},
  signal?: AbortSignal
): Promise<{ list: MyPartyItem[]; page: MyPartiesPage | null }> {
  const qs = new URLSearchParams();

  const base = (BASE_URL ?? '').replace(/\/$/, '');
  const url = `${base}/api/v1/parties/my-parties`;

  if (VALID_STATUS.has(status)) qs.set('status', status);
  if (params.page != null) qs.set('page', String(params.page));
  if (params.size != null) qs.set('size', String(params.size));
  if (params.sort) qs.set('sort', params.sort);

  const finalUrl = qs.toString() ? `${url}?${qs.toString()}` : url;

  const res = await fetch(finalUrl, {
    credentials: 'include',
    headers: { Accept: 'application/json' },
    signal
  });

  const raw = await res.text().catch(() => '');

  if (!res.ok) {
    let parsed = null;
    try {
      parsed = raw ? JSON.parse(raw) : null;
    } catch {}
    const serverMsg =
      parsed?.message || parsed?.error || raw || `HTTP ${res.status}`;
    console.error('fetchMyPartiesServer error:', {
      status: res.status,
      serverMsg,
      finalUrl
    });
    throw new Error(`HTTP ${res.status}: ${serverMsg}`);
  }

  const json = raw ? JSON.parse(raw) : null;

  const page: MyPartiesPage | null =
    json?.content && typeof json.content === 'object'
      ? (json.content as MyPartiesPage)
      : null;

  const rawList: MyPartyItem[] =
    page?.content ??
    (Array.isArray(json?.content) ? (json.content as MyPartyItem[]) : []);

  // 서버 myProgressRate를 그대로 퍼센트로 사용하고, UI 편의 필드(current/max)만 세팅
  const list = (rawList ?? []).map(p => {
    const rate = Number(p.myProgressRate);
    const safeRate = Number.isFinite(rate)
      ? Math.max(0, Math.min(100, Math.round(rate)))
      : 0;
    return {
      ...p,
      myProgressRate: safeRate,
      current: safeRate,
      max: 100
    };
  });

  return { list, page };
}
