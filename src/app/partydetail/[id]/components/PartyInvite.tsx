'use client';

import { useState } from 'react';
import { inviteToParty } from '@/lib/api/parties/partyInvite';
import Button from '@/components/ui/Button';

type Props = {
  partyId: string | number;
  onInvitedAction?: (payload?: unknown) => void | Promise<void>;
};

export default function PartyInvite({ partyId, onInvitedAction }: Props) {
  const [code, setCode] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const submit = async () => {
    const trimmed = code.trim();
    if (!trimmed) {
      setError('초대 코드를 입력하세요.');
      return;
    }
    setPending(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await inviteToParty(partyId, trimmed);
      setSuccess(res.message || '초대가 전송되었습니다.');
      setCode('');
      if (onInvitedAction) await onInvitedAction(res.content);
    } catch (e) {
      const msg = e instanceof Error ? e.message : '초대 전송에 실패했습니다.';
      setError(msg);
    } finally {
      setPending(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !pending) {
      e.preventDefault();
      void submit();
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium" htmlFor="invite-code-input">
        초대 코드
      </label>
      <input
        id="invite-code-input"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="초대 코드를 입력하세요"
        className="w-full rounded-xl p-3 border border-border-card-disabled outline-none focus:ring-2 focus:ring-orange-nuts"
        disabled={pending}
        aria-invalid={!!error}
      />

      <Button
        type="button"
        variant="basic"
        size="md"
        fullWidth
        disabled={pending}
        onClick={() => void submit()}
      >
        {pending ? '전송 중...' : '초대하기'}
      </Button>

      {error && (
        <div className="text-sm text-red-500" role="alert" aria-live="polite">
          {error}
        </div>
      )}
      {success && (
        <div className="text-sm text-green-600" role="status" aria-live="polite">
          {success}
        </div>
      )}
    </div>
  );
}
