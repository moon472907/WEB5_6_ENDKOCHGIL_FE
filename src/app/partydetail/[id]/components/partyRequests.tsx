'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  fetchPartyRequests,
  PartyRequestItem
} from '@/lib/api/parties/partyrequests';
import PartyRequestDecision from './PartyRequestDecision';

type Props = {
  partyId: string | number;
};

export default function PartyRequests({ partyId }: Props) {
  const [items, setItems] = useState<PartyRequestItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await fetchPartyRequests(partyId);
      setItems(list);
    } catch (e) {
      console.error(e);
      setError('신청/초대 대기 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [partyId]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="w-full max-w-[320px] space-y-3 overflow-hidden">
      <h3 className="text-lg font-semibold">신청 대기 목록</h3>

      {loading && <div>불러오는 중...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && items.length === 0 && (
        <div className="text-gray-500">대기 중인 멤버가 없습니다.</div>
      )}

      {!loading && !error && items.length > 0 && (
        <ul className="w-full overflow-hidden rounded-xl border border-gray-200 divide-y divide-gray-100">
          {items.map(u => (
            <li
              key={u.id}
              className="flex items-center justify-between gap-3 bg-basic-white p-3"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-gray-900">
                  {u.name}
                </div>
                <div className="truncate text-xs text-gray-500">{u.email}</div>
              </div>

              <div className="shrink-0">
                <PartyRequestDecision
                  partyId={partyId}
                  request={u}
                  onApprovedAction={memberId =>
                    setItems(prev => prev.filter(x => x.id !== memberId))
                  }
                  onRejectedAction={memberId =>
                    setItems(prev => prev.filter(x => x.id !== memberId))
                  }
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          className="flex-1 rounded-xl bg-orange-nuts px-3 py-2 text-white"
          onClick={() => void load()}
        >
          새로고침
        </button>
      </div>
    </div>
  );
}
