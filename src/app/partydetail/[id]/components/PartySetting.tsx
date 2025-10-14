'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import ConfirmModal from '@/components/modal/ConfirmModal';
import BaseModal from '@/components/modal/BaseModal';
import { useRouter } from 'next/navigation';
import { deletePartyClient, updatePartyClient, leavePartyClient } from '@/lib/api/parties/parties';

interface Props {
  partyId: string | number;
  initialName?: string;
  initialMaxMembers?: number;
  initialIsPublic?: boolean;
  // 현재 사용자가 리더인지 여부 (부모 컴포넌트에서 판단해서 전달)
  isLeader?: boolean;
}

export default function PartySetting({
  partyId,
  initialName = '',
  initialMaxMembers = 4,
  initialIsPublic = true,
  isLeader = false
}: Props) {
  const router = useRouter();

  const [editOpen, setEditOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState(initialName);
  const [maxMembers, setMaxMembers] = useState<number>(initialMaxMembers);
  const [isPublic, setIsPublic] = useState<boolean>(initialIsPublic);

  // alert 대체용 결과 모달 상태
  const [resultOpen, setResultOpen] = useState(false);
  const [resultLines, setResultLines] = useState<string[]>([]);
  const [resultVariant, setResultVariant] = useState<'happy' | 'sad'>('happy');
  const [redirectAfterClose, setRedirectAfterClose] = useState<string | null>(null);

  const handleUpdate = async () => {
    try {
      setSaving(true);
      await updatePartyClient(partyId, {
        name: name || undefined,
        maxMembers: Number(maxMembers) || undefined,
        isPublicStatus: Boolean(isPublic)
      });
      setEditOpen(false);
      router.refresh();
      setResultLines(['파티 정보가 수정되었습니다.']);
      setResultVariant('happy');
      setRedirectAfterClose(null);
      setResultOpen(true);
    } catch (e) {
      console.error(e);
      setResultLines(['파티 수정에 실패했습니다.']);
      setResultVariant('sad');
      setResultOpen(true);
    } finally {
      setSaving(false);
    }
  };

  const handleLeave = async () => {
    try {
      await leavePartyClient(partyId);
      setResultLines(['파티에서 탈퇴했습니다.']);
      setResultVariant('happy');
      setRedirectAfterClose('/');
      setResultOpen(true);
    } catch (e) {
      console.error(e);
      setResultLines(['파티 탈퇴에 실패했습니다.']);
      setResultVariant('sad');
      setResultOpen(true);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePartyClient(partyId);
      setResultLines(['파티가 삭제되었습니다.']);
      setResultVariant('happy');
      setRedirectAfterClose('/');
      setResultOpen(true);
    } catch (e) {
      console.error(e);
      setResultLines(['파티 삭제에 실패했습니다.']);
      setResultVariant('sad');
      setResultOpen(true);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {isLeader && (
        <Button variant="basic" size="md" fullWidth onClick={() => setEditOpen(true)}>
          파티 수정
        </Button>
        )}

        {/* 리더는 직접 탈퇴할 수 없도록 버튼 미노출 */}
        {!isLeader && (
          <Button variant="basic" size="md" fullWidth onClick={() => setLeaveOpen(true)}>
            파티 탈퇴
          </Button>
        )}

        {/* 삭제 버튼은 리더에게만 노출 */}
        {isLeader && (
          <Button variant="cancel" size="md" fullWidth onClick={() => setDeleteOpen(true)}>
            파티 삭제
          </Button>
        )}
      </div>

     {/* 결과 표시용 ConfirmModal (alert 대체) */}
     <ConfirmModal
       open={resultOpen}
       lines={resultLines}
       onConfirm={() => {
         setResultOpen(false);
         if (redirectAfterClose) {
           router.push(redirectAfterClose);
         }
       }}
       onCancel={() => setResultOpen(false)}
       confirmText="확인"
       cancelText=""
       variant={resultVariant}
     />

      {/* 수정 모달 (간단한 폼) */}
      <BaseModal isOpen={editOpen} onClose={() => setEditOpen(false)}>
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold">파티 수정</h3>

          <label className="text-sm">파티 이름</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className="rounded-xl p-3 border border-border-card-disabled"
          />

          <label className="text-sm">최대 참여 인원</label>
          <input
            type="number"
            min={1}
            max={5}
            value={maxMembers}
            onChange={e => setMaxMembers(Number(e.target.value))}
            className="rounded-xl p-3 border border-border-card-disabled"
          />

          <label className="flex items-center gap-2">
            <input type="checkbox" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} />
            공개 여부
          </label>

          <div className="flex gap-3">
            <Button type="button" variant="cancel" size="md" fullWidth onClick={() => setEditOpen(false)}>
              취소
            </Button>
            <Button type="button" variant="basic" size="md" fullWidth onClick={handleUpdate} disabled={saving}>
              저장
            </Button>
          </div>
        </div>
      </BaseModal>

      {/* 탈퇴 확인 모달 */}
      <ConfirmModal
        open={leaveOpen}
        lines={['파티를 탈퇴하시겠습니까?']}
        onConfirm={() => {
          setLeaveOpen(false);
          handleLeave();
        }}
        onCancel={() => setLeaveOpen(false)}
        confirmText="탈퇴"
        cancelText="취소"
        variant="sad"
      />

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        open={deleteOpen}
        lines={['파티를 삭제하시겠습니까?', '삭제된 파티는 복구할 수 없습니다.']}
        onConfirm={() => {
          setDeleteOpen(false);
          handleDelete();
        }}
        onCancel={() => setDeleteOpen(false)}
        confirmText="삭제"
        cancelText="취소"
        variant="sad"
      />
    </>
  );
}
