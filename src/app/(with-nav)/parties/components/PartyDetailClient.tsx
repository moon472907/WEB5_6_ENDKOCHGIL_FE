'use client';

import React, { useEffect, useState, useCallback } from 'react';
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
  subtitle?: string; // email
  title?: string | null;
  item?: { id?: number; name?: string; iconUrl?: string | null } | null;
  crowned?: boolean;
};

// 아이콘 없으면 기본 이미지 사용
function resolveItemIconSrc(item?: Member['item'] | null): string {
  const fallback = '/images/nuts-default.png';
  if (!item) return fallback;

  const icon = typeof item.iconUrl === 'string' ? item.iconUrl.trim() : '';
  if (icon.length > 0) return encodeURI(icon); // 한글/공백 대응

  const id = typeof item.id === 'number' ? item.id : undefined;
  if (typeof id === 'number' && Number.isFinite(id)) return `/items/${id}.png`;
  return fallback;
}

export default function PartyDetailClient({ partyId }: { partyId: string }) {
  const router = useRouter();

  const [members, setMembers] = useState<Member[]>([]);
  const [currentUserName, setCurrentUserName] = useState<string>('');
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [leaderId, setLeaderId] = useState<number | null>(null);
  const [currentUserTitle, setCurrentUserTitle] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [partyName, setPartyName] = useState<string>('');
  const [partyMaxMembers, setPartyMaxMembers] = useState<number>(4);
  const [partyIsPublic, setPartyIsPublic] = useState<boolean>(true);

  const [settingOpen, setSettingOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [manageTab, setManageTab] = useState<'requests' | 'invite'>('requests');

  const loadPartyDetail = useCallback(
    async (opts?: { silent?: boolean }) => {
      const silent = opts?.silent === true;
      let mounted = true;
      try {
        if (!silent) {
          setLoading(true);
          setError(null);
        }
        const detail = await fetchPartyDetailClient(partyId, { includeDecorations: true });
        if (!mounted) return;

        const parsedLeaderId =
          typeof detail.leaderId === 'number'
            ? detail.leaderId
            : Number(detail.leaderId);
        setLeaderId(Number.isFinite(parsedLeaderId) ? parsedLeaderId : null);

        setPartyName(String(detail.name ?? ''));
        setPartyMaxMembers(
          typeof detail.maxMembers === 'number' ? detail.maxMembers : 4
        );
        setPartyIsPublic(Boolean(detail.isPublic));

        const rawMembers = (detail.members ?? []) as Array<
          Record<string, unknown>
        >;
        const mapped: Member[] = rawMembers.map(m => {
          const id =
            typeof m['id'] === 'number' ? (m['id'] as number) : Number(m['id']);
          const name =
            typeof m['name'] === 'string'
              ? (m['name'] as string)
              : `회원 ${id ?? ''}`;

          const title =
            m['title'] === null
              ? null
              : typeof m['title'] === 'string'
              ? (m['title'] as string)
              : undefined;

          let item: Member['item'] = null;
          const rawItem = m['item'];
          if (rawItem && typeof rawItem === 'object') {
            const r = rawItem as Record<string, unknown>;
            const itemId =
              typeof r.id === 'number'
                ? r.id
                : typeof r.id === 'string' &&
                  r.id.trim() !== '' &&
                  !Number.isNaN(Number(r.id))
                ? Number(r.id)
                : undefined;
            const itemName =
              typeof r.name === 'string' ? (r.name as string) : undefined;
            const iconUrl =
              r.iconUrl === null
                ? null
                : typeof r.iconUrl === 'string'
                ? (r.iconUrl as string)
                : undefined;
            item = { id: itemId, name: itemName, iconUrl };
          }

          return {
            id,
            name,
            subtitle:
              typeof m['email'] === 'string'
                ? (m['email'] as string)
                : undefined,
            title,
            item,
            crowned: parsedLeaderId === id
          };
        });
        setMembers(mapped);
      } catch (err) {
        console.error(err);
        if (!silent) setError('파티 상세 정보를 불러오는 데 실패했습니다.');
      } finally {
        if (!silent) setLoading(false);
      }
      return () => {
        mounted = false;
      };
    },
    [partyId]
  );

  useEffect(() => {
    void loadPartyDetail();
  }, [loadPartyDetail]);

  useEffect(() => {
    const id = window.setInterval(() => {
      void loadPartyDetail({ silent: true });
    }, 2000);
    return () => window.clearInterval(id);
  }, [loadPartyDetail]);

  useEffect(() => {
    (async () => {
      try {
        const me = await getMyInfo(undefined);
        setCurrentUserName(
          typeof me?.name === 'string'
            ? me.name
            : typeof me?.email === 'string'
            ? me.email
            : ''
        );
        setCurrentUserEmail(
          typeof me?.email === 'string' && me.email.trim() !== ''
            ? me.email
            : null
        );
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
            <div className="relative w-20 h-20 overflow-hidden rounded-md mb-2 bg-gray-100">
              {(() => {
                const base = resolveItemIconSrc(m.item);
                const finalSrc = base.startsWith('http') ? base : encodeURI(base);
                return (
                  <Image
                    src={finalSrc}
                    alt={m.item?.name ?? '아이템'}
                    fill
                    sizes="80px"
                    className="object-cover object-center"
                    priority
                  />
                );
              })()}
            </div>

            {/* 칭호 */}
            <div className="text-xs text-gray-05">
              {m.title !== undefined
                ? m.title ?? '칭호 없음'
                : m.id && currentUserId && m.id === currentUserId
                ? currentUserTitle ?? '칭호 없음'
                : '칭호 없음'}
            </div>

            {/* 이름 */}
            <div className="text-sm text-gray-10 font-medium">{m.name}</div>

            {/* 리더 왕관 */}
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

      {/* 파티 설정 버튼 */}
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
      {currentUserId !== null &&
        leaderId !== null &&
        currentUserId === leaderId && (
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
          isLeader={
            currentUserId !== null &&
            leaderId !== null &&
            currentUserId === leaderId
          }
        />
      </BaseModal>

      {/* 신청/초대 관리 모달 */}
      <BaseModal isOpen={manageOpen} onClose={() => setManageOpen(false)}>
        <div className="w-[360px] max-w-full space-y-3">
          <h3 className="text-lg font-semibold">신청/초대 관리</h3>
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-gray-100 p-1">
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

          {manageTab === 'requests' && <PartyRequests partyId={partyId} />}

          {manageTab === 'invite' && (
            <PartyInvite
              partyId={partyId}
              onInvitedAction={async () => {
                await loadPartyDetail({ silent: true });
                setManageTab('requests');
              }}
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
