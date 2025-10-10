import { BASE_URL } from "../config";

// types 정의
export type PartyApiItem = {
  id: number;
  name: string;
  leaderId?: number;
  currentMembers?: number;
  maxMembers?: number;
  isPublic?: boolean;
  members?: { id: number; email?: string; name?: string }[];
  missionId?: number;
  category?: 'EXERCISE' | 'LEARNING' | 'HABIT' | 'MENTAL' | 'CUSTOM' | string;
  startDate?: string;
  endDate?: string;
  createDate?: string;
  views?: number;
};

export type PartiesPage = {
  totalElements: number;
  totalPages: number;
  size: number;
  content: PartyApiItem[];
  number: number;
};

// 환경변수 기반 base url
function getBaseUrl(): string {
  return (BASE_URL ?? '').replace(/\/$/, '');
}

// 안전한 JSON 파싱
function safeJsonParse<T = unknown>(text: string): T | null {
  try {
    return text ? (JSON.parse(text) as T) : null;
  } catch {
    return null;
  }
}

// API 응답 타입
type PartiesApiResponse =
  | { content: PartiesPage } // Page 형태
  | { content: PartyApiItem[] }; // 단순 배열 형태

/**
 * 클라이언트에서 파티 목록 조회
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
  // 쿼리스트링 만들기
  const qs = new URLSearchParams();
  if (params.page !== undefined) qs.set('page', String(params.page));
  if (params.size !== undefined) qs.set('size', String(params.size));
  if (params.sort) qs.set('sort', params.sort);
  if (params.category) qs.set('category', params.category);
  if (params.startDate) qs.set('startDate', params.startDate);

  // URL 조립
  const base = getBaseUrl();
  const url = base
    ? `${base}/api/v1/parties?${qs.toString()}`
    : `/api/v1/parties?${qs.toString()}`;

  // GET 요청
  const res = await fetch(url, {
    credentials: 'include',
    headers: { Accept: 'application/json' },
    signal
  });

  // 응답 텍스트 확보
  const text = await res.text().catch(() => '');

  // 에러 발생 시 바로 throw
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  // JSON 파싱
  const parsed = res.headers.get('content-type')?.includes('application/json')
    ? safeJsonParse<PartiesApiResponse>(text)
    : null;

  const raw: PartiesApiResponse = parsed ?? { content: [] };

  // 리스트 추출
  const list = Array.isArray(raw.content)
    ? (raw.content as PartyApiItem[])
    : raw.content.content;

  const pageMeta = Array.isArray(raw.content) ? null : raw.content;

  return { list, pageMeta, raw };
}

/**
 * 서버에서 사용할 때도 동일한 fetch
 */
export async function fetchPartiesServer(
  params: {
    page?: number;
    size?: number;
    sort?: string;
    category?: string;
    startDate?: string;
  } = {}
): Promise<{
  list: PartyApiItem[];
  pageMeta: PartiesPage | null;
  raw: PartiesApiResponse;
}> {
  return fetchPartiesClient(params);
}

export async function fetchPartyDetailClient(partyId: string | number): Promise<PartyApiItem> {
  const url = `${BASE_URL}/api/v1/parties/${partyId}`;
  const res = await fetch(url, { credentials: 'include', headers: { Accept: 'application/json' } });

  if (!res.ok) {
    throw new Error(`fetchPartyDetailClient: HTTP ${res.status}`);
  }

  const json = await res.json();
  if (json && typeof json === 'object' && 'content' in json) {
    return json.content as PartyApiItem;
  }

  return json as PartyApiItem;
}

export async function joinPartyClient(partyId: string | number): Promise<void> {
  const url = `${BASE_URL}/api/v1/parties/${partyId}/join`;
  const res = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`joinPartyClient: HTTP ${res.status} ${text}`);
  }
}
