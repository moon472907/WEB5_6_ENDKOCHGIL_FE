// 파티 신청/초대 수락/거절 API 클라이언트

import { BASE_URL } from '../config';

const getBaseUrl = (): string => {
  const base = (BASE_URL ?? '').replace(/\/$/, '');
  if (base) return base;
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin.replace(/\/$/, '');
  }
  return 'http://localhost:8080';
};

type ApiErrorBody = {
  message?: string;
  error?: string;
  code?: string;
  success?: boolean;
  [k: string]: unknown;
};

const handleError = async (res: Response): Promise<never> => {
  let msg = `HTTP ${res.status}`;
  try {
    const j: unknown = await res.json();
    if (j && typeof j === 'object') {
      const r = j as ApiErrorBody;
      const m = r.message;
      if (typeof m === 'string' && m.trim().length > 0) {
        msg = m;
      } else {
        const e = r.error;
        if (typeof e === 'string' && e.trim().length > 0) {
          msg = e;
        }
      }
    }
  } catch {
    // ignore json parse errors
  }
  throw new Error(msg || '서버 내부 오류가 발생하였습니다.');
};

// 가입 신청/초대 수락
export async function acceptPartyRequest(partyId: string | number, memberId: number): Promise<void> {
  const base = getBaseUrl();
  const url = `${base}/api/v1/parties/${encodeURIComponent(String(partyId))}/accept`;
  const res = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', Accept: '*/*' },
    body: JSON.stringify({ memberId }),
  });
  if (!res.ok) await handleError(res);
}

// 가입 신청/초대 거절
export async function rejectPartyRequest(partyId: string | number, memberId: number): Promise<void> {
  const base = getBaseUrl();
  const url = `${base}/api/v1/parties/${encodeURIComponent(String(partyId))}/reject`;
  const res = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', Accept: '*/*' },
    body: JSON.stringify({ memberId }),
  });
  if (!res.ok) await handleError(res);
}
