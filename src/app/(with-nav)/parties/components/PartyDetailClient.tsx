'use client';

import React, { useEffect, useState } from 'react';
import PartySetting from '@/app/partydetail/[id]/components/PartySetting';
import BaseModal from '@/components/modal/BaseModal';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { fetchPartyDetailClient } from '@/lib/api/parties/parties';
import { getMyInfo } from '@/lib/api/member';
import { useRouter } from 'next/navigation';
import PartyChat from '@/app/partydetail/components/partyChat';
import PartyRequests from '@/app/partydetail/[id]/components/partyRequests';
import PartyInvite from '@/app/partydetail/[id]/components/PartyInvite';

type Member = {
  id?: number;
  name: string;
  subtitle?: string;
  title?: string;
  crowned?: boolean;
};

export default function PartyDetailClient({ partyId }: { partyId: string }) {
  const router = useRouter();

  const [members, setMembers] = useState<Member[]>([]);
  const [currentUserName, setCurrentUserName] = useState<string>(''); // display name
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null); // email (server id)
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [leaderId, setLeaderId] = useState<number | null>(null);
  const [currentUserTitle, setCurrentUserTitle] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 파티 기본 정보 (PartySetting 전달용)
  const [partyName, setPartyName] = useState<string>('');
  const [partyMaxMembers, setPartyMaxMembers] = useState<number>(4);
  const [partyIsPublic, setPartyIsPublic] = useState<boolean>(true);

  // 설정 모달 열림 상태
  const [settingOpen, setSettingOpen] = useState(false);
  // 신청/초대 관리 모달 상태
  const [manageOpen, setManageOpen] = useState(false);
  const [manageTab, setManageTab] = useState<'requests' | 'invite'>('requests');

  // 1) 파티 상세 + 멤버
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const detail = await fetchPartyDetailClient(partyId);
        if (!mounted) return;

        const parsedLeaderId = typeof detail.leaderId === 'number' ? detail.leaderId : Number(detail.leaderId);
        setLeaderId(Number.isFinite(parsedLeaderId) ? parsedLeaderId : null);

        setPartyName(String(detail.name ?? ''));
        setPartyMaxMembers(typeof detail.maxMembers === 'number' ? detail.maxMembers : 4);
        setPartyIsPublic(Boolean(detail.isPublic));

        const rawMembers = (detail.members ?? []) as Array<Record<string, unknown>>;
        const mapped: Member[] = rawMembers.map((m) => {
          const id = typeof m['id'] === 'number' ? (m['id'] as number) : Number(m['id']);
          const name = typeof m['name'] === 'string' ? (m['name'] as string) : `회원 ${id ?? ''}`;
          return {
            id,
            name,
            subtitle: typeof m['email'] === 'string' ? (m['email'] as string) : undefined,
            title: typeof m['title'] === 'string' ? (m['title'] as string) : undefined,
            crowned: parsedLeaderId === id
          };
        });
        setMembers(mapped);
      } catch (err) {
        console.error(err);
        setError('파티 상세 정보를 불러오는 데 실패했습니다.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [partyId]);

  // 2) 내 정보 분리 저장 (이름 / 이메일 / 아이디 / 칭호)
  useEffect(() => {
    (async () => {
      try {
        const me = await getMyInfo(undefined);
        setCurrentUserName(typeof me?.name === 'string' ? me.name : (typeof me?.email === 'string' ? me.email : ''));
        // 이메일이 빈 문자열일 경우 null로 처리하여 잘못된 senderEmail 전송을 방지
        setCurrentUserEmail(typeof me?.email === 'string' && me.email.trim() !== '' ? me.email : null);
        setCurrentUserId(typeof me?.id === 'number' ? me.id : null);
        setCurrentUserTitle(me?.title ?? null);
      } catch (err) {
        console.error('[ERROR] 내 정보 조회 실패:', err);
      }
    })();
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      {/* 멤버 그리드 */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {members.map(m => (
          <div
            key={m.id ?? m.name}
            className="relative rounded-lg bg-basic-white p-3 flex flex-col items-center text-center shadow-sm"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center mb-2">
              <span className="text-base font-semibold text-gray-08">
                {m.name && m.name.length > 0 ? m.name.charAt(0) : '?'}
                <br />
                (이미지)
              </span>
            </div>
            <div className="text-xs text-gray-05">
              {m.title
                ? m.title
                : m.id && currentUserId && m.id === currentUserId
                ? currentUserTitle ?? '칭호 없음'
                : '칭호 없음'}
            </div>
            <div className="text-sm text-gray-10 font-medium">{m.name}</div>
            {m.crowned && (
              <div className="absolute left-2 top-2">
                <Image src="/crown.svg" alt="왕관" width={28} height={28} />
              </div>
            )}
          </div>
        ))}
        <div className="rounded-lg bg-basic-white p-3 flex items-center justify-center text-2xl text-gray-300">
          <Image src="/not.svg" alt="빈 슬롯" width={80} height={80} />
        </div>
      </div>

      {/* 파티 계획 버튼 */}
      <div className="mb-4">
        <Button
          variant="basic"
          size="md"
          fullWidth
          onClick={() =>
            router.push(`/partyplan?partyId=${encodeURIComponent(partyId)}`)
          }
        >
          파티 계획
        </Button>
      </div>

      {/* 파티 설정 버튼 (모달로 열기) */}
      <div className="mb-4">
        <Button
          variant="basic"
          size="md"
          fullWidth
          onClick={() => setSettingOpen(true)}
        >
          파티 설정
        </Button>
      </div>

      {/* 신청/초대 관리 버튼 (리더 전용) */}
      {currentUserId !== null && leaderId !== null && currentUserId === leaderId && (
        <div className="mb-4">
          <Button
            variant="basic"
            size="md"
            fullWidth
            onClick={() => {
              setManageTab('requests');
              setManageOpen(true);
            }}
          >
            신청/초대 관리
          </Button>
        </div>
      )}

      {/* 설정 모달 */}
      <BaseModal isOpen={settingOpen} onClose={() => setSettingOpen(false)}>
        <PartySetting
          partyId={partyId}
          initialName={partyName}
          initialMaxMembers={partyMaxMembers}
          initialIsPublic={partyIsPublic}
          isLeader={currentUserId !== null && leaderId !== null && currentUserId === leaderId}
        />
      </BaseModal>

      {/* 신청/초대 관리 모달 */}
      <BaseModal isOpen={manageOpen} onClose={() => setManageOpen(false)}>
        <div className="w-[360px] max-w-full space-y-3">
          <h3 className="text-lg font-semibold">신청/초대 관리</h3>
          {/* 탭 전환 버튼 */}
          <div className="grid grid-cols-2 rounded-xl bg-gray-100 p-1">
            <Button
              fullWidth
              size="md"
              variant={manageTab === 'requests' ? 'basic' : 'unselected'}
              onClick={() => setManageTab('requests')}
            >
              신청 목록
            </Button>
            <Button
              fullWidth
              size="md"
              variant={manageTab === 'invite' ? 'basic' : 'unselected'}
              onClick={() => setManageTab('invite')}
            >
              초대
            </Button>
          </div>

          {/* 신청 목록 */}
          {manageTab === 'requests' && (
            <PartyRequests partyId={partyId} />
          )}

          {/* 초대 */}
          {manageTab === 'invite' && (
            <PartyInvite
              partyId={partyId}
              onInvitedAction={() => setManageTab('requests')} // 초대 후 목록 탭으로 전환(선택)
            />
          )}
        </div>
      </BaseModal>

      <PartyChat
        partyId={partyId}
        currentUserId={currentUserId}
        currentUserEmail={currentUserEmail}
        currentUserName={currentUserName}
        initialMembers={members}
      />
    </div>
  );
}
