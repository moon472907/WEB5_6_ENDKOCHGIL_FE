// 파티 초대(코드) API 클라이언트

import { BASE_URL } from '../config';
import { acceptPartyRequest } from './partyrequestdecision'; // 초대 후 즉시 수락

export type PartyMemberStatus = 'PENDING' | 'INVITED' | 'ACCEPTED' | 'REJECTED';

export type InviteResponse = {
  success?: boolean;
  code?: string;
  message?: string;
  content?: {
    memberId?: number;
    status?: PartyMemberStatus;
    [k: string]: unknown;
  } | null;
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
    const j: unknown = await res.json();
    if (j && typeof j === 'object') {
      const m = (j as Record<string, unknown>).message;
      if (typeof m === 'string') msg = m || msg;
    }
  } catch {
    // ignore
  }
  throw new Error(msg);
};

function toInviteResponse(raw: unknown): InviteResponse {
  const out: InviteResponse = {};
  if (!raw || typeof raw !== 'object') return out;

  const r = raw as Record<string, unknown>;
  if (typeof r.success === 'boolean') out.success = r.success;
  if (typeof r.code === 'string') out.code = r.code;
  if (typeof r.message === 'string') out.message = r.message;

  if ('content' in r && (r.content === null || typeof r.content === 'object')) {
    const c = r.content as Record<string, unknown> | null;
    if (c === null) {
      out.content = null;
    } else {
      const memberId = typeof c.memberId === 'number' ? c.memberId : undefined;

      const s = c.status;
      const isStatus =
        s === 'PENDING' || s === 'INVITED' || s === 'ACCEPTED' || s === 'REJECTED';
      const status: PartyMemberStatus | undefined = isStatus ? (s as PartyMemberStatus) : undefined;

      const content: InviteResponse['content'] = {};
      if (memberId !== undefined) content.memberId = memberId;
      if (status !== undefined) content.status = status;
      out.content = content;
    }
  }

  return out;
}

export async function inviteToParty(
  partyId: string | number,
  invitedMemberCode: string,
  signal?: AbortSignal,
  opts?: { autoAccept?: boolean } // 기본: 즉시 수락
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

  const raw: unknown = await res.json().catch(() => ({}));
  if (!res.ok) await handleError(res);

  const obj = toInviteResponse(raw);

  const shouldAutoAccept = opts?.autoAccept !== false;
  const memberId = obj.content?.memberId;

  if (shouldAutoAccept && typeof memberId === 'number') {
    await acceptPartyRequest(partyId, memberId);
    obj.content = { ...(obj.content ?? {}), memberId, status: 'ACCEPTED' };
  }

  return obj;
}
