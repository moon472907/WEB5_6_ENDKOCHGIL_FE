// 파티 신청/초대 대기 목록 조회 API 클라이언트

import { BASE_URL } from '../config';

export type PartyRequestItem = {
  id: number;
  email: string;
  name: string;
  status: string;
};

const toNumber = (v: unknown): number | undefined =>
  typeof v === 'number'
    ? v
    : typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v))
    ? Number(v)
    : undefined;

const getBaseUrl = (): string => {
  const base = (BASE_URL ?? '').replace(/\/$/, '');
  if (base) return base;
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin.replace(/\/$/, '');
  }
  return 'http://localhost:8080';
};

export async function fetchPartyRequests(
  partyId: string | number,
  signal?: AbortSignal
): Promise<PartyRequestItem[]> {
  const base = getBaseUrl();
  const url = `${base}/api/v1/parties/${encodeURIComponent(String(partyId))}/requests`;

  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
    signal
  });
  if (!res.ok) throw new Error(`fetchPartyRequests: HTTP ${res.status}`);

  const json: unknown = await res.json().catch(() => null);

  // { success, code, message, content: [...] } 혹은 바로 [...]
  const content = (json && typeof json === 'object' && json !== null && 'content' in json)
    ? (json as { content: unknown }).content
    : json;

  if (!Array.isArray(content)) return [];

  const mapItem = (u: unknown): PartyRequestItem | null => {
    if (!u || typeof u !== 'object') return null;
    const r = u as Record<string, unknown>;
    const id = toNumber(r.id);
    const email = typeof r.email === 'string' ? r.email : '';
    const name = typeof r.name === 'string' ? r.name : '';
    const status = typeof r.status === 'string' ? r.status : '';
    if (id == null) return null;
    return { id, email, name, status };
  };

  return content.map(mapItem).filter((v): v is PartyRequestItem => v !== null);
}
