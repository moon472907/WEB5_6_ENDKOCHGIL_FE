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
  return (process.env.NEXT_PUBLIC_API_BASE_URL_DEV ?? '').replace(/\/$/, '');
}

// 안전한 JSON 파싱
function safeJsonParse<T = unknown>(text: string): T | null {
  try {
    return text ? (JSON.parse(text) as T) : null;
  } catch {
    return null;
  }
}

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
  raw: unknown;
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
    ? safeJsonParse<unknown>(text)
    : null;
  const raw = parsed ?? {};

  // 리스트 추출
  const list =
    ((raw as unknown)?.content?.content as PartyApiItem[] | undefined) ??
    ((raw as unknown)?.content as PartyApiItem[] | undefined) ??
    ([] as PartyApiItem[]);
  const pageMeta = ((raw as unknown)?.content as PartiesPage | undefined) ?? null;

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
  raw: unknown;
}> {
  return fetchPartiesClient(params);
}
