// 파티 초대(코드) API 클라이언트

import { BASE_URL } from '../config';

export type InviteResponse = {
  success?: boolean;
  code?: string;
  message?: string;
  content?: unknown;
};

const getBaseUrl = (): string => {
  const base = (BASE_URL ?? '').replace(/\/$/, '');
  if (base) return base;
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin.replace(/\/$/, '');
  }
  return 'http://localhost:8080';
};

const handleError = async (res: Response) => {
  let msg = `HTTP ${res.status}`;
  try {
    const j = await res.json();
    if (j && typeof j === 'object' && 'message' in j && typeof j.message === 'string') {
      msg = j.message || msg;
    }
  } catch {
    // ignore
  }
  throw new Error(msg);
};

export async function inviteToParty(
  partyId: string | number,
  invitedMemberCode: string,
  signal?: AbortSignal
): Promise<InviteResponse> {
  const base = getBaseUrl();
  const url = `${base}/api/v1/parties/${encodeURIComponent(String(partyId))}/invite`;

  const res = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    signal,
    body: JSON.stringify({ invitedMemberCode }),
  });

  const json: unknown = await res.json().catch(() => ({}));

  if (!res.ok) await handleError(res);

  const obj = (json && typeof json === 'object' ? (json as Record<string, unknown>) : {}) as {
    success?: boolean;
    code?: string;
    message?: string;
    content?: unknown;
  };

  return {
    success: obj.success,
    code: obj.code,
    message: obj.message,
    content: obj.content,
  };
}
