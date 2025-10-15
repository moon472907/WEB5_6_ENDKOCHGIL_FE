'use client';

import { useState } from 'react';
import { acceptPartyRequest, rejectPartyRequest } from '@/lib/api/parties/partyrequestdecision';
import type { PartyRequestItem } from '@/lib/api/parties/partyrequests';

type Props = {
  partyId: string | number;
  request: PartyRequestItem; // id = memberId
  onApprovedAction?: (memberId: number) => void | Promise<void>;
  onRejectedAction?: (memberId: number) => void | Promise<void>;
  disabled?: boolean; // 예: 정원 꽉 참 등으로 비활성화
};

export default function PartyRequestDecision({
  partyId,
  request,
  onApprovedAction,
  onRejectedAction,
  disabled = false,
}: Props) {
  const [pending, setPending] = useState<null | 'approve' | 'reject'>(null);
  const [err, setErr] = useState<string | null>(null);

  const handleApprove = async () => {
    if (pending || disabled) return;
    setErr(null);
    setPending('approve');
    try {
      await acceptPartyRequest(partyId, request.id);
      if (onApprovedAction) await onApprovedAction(request.id);
    } catch (e) {
      console.error(e);
      setErr('승인에 실패했습니다.');
    } finally {
      setPending(null);
    }
  };

  const handleReject = async () => {
    if (pending || disabled) return;
    setErr(null);
    setPending('reject');
    try {
      await rejectPartyRequest(partyId, request.id);
      if (onRejectedAction) await onRejectedAction(request.id);

    } catch (e) {
      console.error(e);
      setErr('거절에 실패했습니다.');
    } finally {
      setPending(null);
    }
  };
  const isBlocked = disabled || pending !== null;

  return (
    <div className="flex items-center gap-2">
      {/* 승인 */}
      <button
        type="button"
        aria-label="승인"
        title="승인"
        onClick={handleApprove}
        disabled={isBlocked}
        className={`rounded-lg px-2 py-1 text-sm cursor-pointer ${
          isBlocked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-50'
        } text-orange-nuts border border-orange-nuts`}
      >
        ✓
      </button>

      {/* 거절 */}
      <button
        type="button"
        aria-label="거절"
        title="거절"
        onClick={handleReject}
        disabled={isBlocked}
        className={`rounded-lg px-2 py-1 text-sm cursor-pointer ${
          isBlocked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
        } text-gray-700 border border-gray-300`}
      >
        ✕
      </button>

      {/* 행 내 간단 오류표시 */}
      {err && <span className="ml-2 text-xs text-red-500">{err}</span>}
    </div>
  );
}
