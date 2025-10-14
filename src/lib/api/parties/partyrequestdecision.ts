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

const commonOptions = {
  method: 'POST' as const,
  credentials: 'include' as const,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  cache: 'no-store' as const
};

const handleError = async (res: Response) => {
  let msg = `HTTP ${res.status}`;
  try {
    const j = await res.json();
    if (
      j &&
      typeof j === 'object' &&
      'message' in j &&
      typeof j.message === 'string'
    ) {
      msg = j.message || msg;
    }
  } catch {
    // ignore
  }
  throw new Error(msg);
};

// 승인
export async function acceptPartyRequest(
  partyId: string | number,
  memberId: number,
  signal?: AbortSignal
): Promise<void> {
  const base = getBaseUrl();
  const url = `${base}/api/v1/parties/${encodeURIComponent(
    String(partyId)
  )}/accept`;

  const res = await fetch(url, {
    ...commonOptions,
    signal,
    body: JSON.stringify({ memberId })
  });

  if (!res.ok) await handleError(res);
}

// 거절
export async function rejectPartyRequest(
  partyId: string | number,
  memberId: number,
  signal?: AbortSignal
): Promise<void> {
  const base = getBaseUrl();
  const url = `${base}/api/v1/parties/${encodeURIComponent(
    String(partyId)
  )}/reject`;

  const res = await fetch(url, {
    ...commonOptions,
    signal,
    body: JSON.stringify({ memberId })
  });

  if (!res.ok) await handleError(res);
}
