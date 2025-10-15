'use client';

import Button from '@/components/ui/Button';
import Tag from '@/components/ui/Tag';
import ConfirmModal from '@/components/modal/ConfirmModal';
import React, { useState } from 'react';
import { mapTag, variantToKorean } from '@/lib/tag';
import type { PartyApiItem } from '@/lib/api/parties/parties';
import { joinPartyClient } from '@/lib/api/parties/parties';
import { useRouter } from 'next/navigation';

export default function PartyCard({
  category,
  title,
  startAt,
  endAt,
  people,
  id,
  alreadyJoined, // 추가: 선택적 프롭으로 이미 참여 여부 전달 가능
}: {
  category?: PartyApiItem['category'];
  isPublic?: boolean;
  title: string;
  startAt?: string;
  endAt?: string;
  people?: string;
  id?: number | string;
  alreadyJoined?: boolean; // 추가
}) {
  const router = useRouter();

  // 시작일 포맷: "2025년 9월 21일"
  const formatKoreanDate = (iso?: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  };

  // 시작/종료일로 총 기간(주) 계산 — inclusive 기준, 7일 = 1주
  const calcWeeks = (sIso?: string, eIso?: string) => {
    if (!sIso || !eIso) return null;
    const s = new Date(sIso);
    const e = new Date(eIso);
    if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return null;
    const msPerDay = 1000 * 60 * 60 * 24;
    const days = Math.round((e.getTime() - s.getTime()) / msPerDay) + 1;
    return Math.max(1, Math.ceil(days / 7));
  };

  const startText = formatKoreanDate(startAt);
  const weeks = calcWeeks(startAt, endAt);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openResult, setOpenResult] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [errorLines, setErrorLines] = useState<string[]>([
    '참가 신청에 실패했습니다.',
    '잠시 후 다시 시도해 주세요.',
  ]);
  const isFull = (() => {
    if (!people) return false;
    const m = /^(\d+)\s*\/\s*(\d+)$/.exec(people);
    if (!m) return false;
    const cur = parseInt(m[1], 10);
    const max = parseInt(m[2], 10);
    return Number.isFinite(cur) && Number.isFinite(max) && cur >= max;
  })();

  // 현재 파티 참여 여부(프롭이 없으면 클릭 시 한 번 조회) - any 미사용
  const checkAlreadyJoined = async (partyId: number | string): Promise<boolean> => {
    if (alreadyJoined === true) return true;
    if (alreadyJoined === false) return false;

    // 타입 가드
    const isPartyApiItem = (o: unknown): o is PartyApiItem => {
      return typeof o === 'object' && o !== null && 'id' in o && typeof (o as { id: unknown }).id === 'number';
    };
    const hasContentArray = (d: unknown): d is { content: PartyApiItem[] } => {
      if (typeof d !== 'object' || d === null || !('content' in d)) return false;
      const c = (d as { content: unknown }).content;
      return Array.isArray(c) && c.every(isPartyApiItem);
    };
    const hasNestedContentArray = (d: unknown): d is { content: { content: PartyApiItem[] } } => {
      if (typeof d !== 'object' || d === null || !('content' in d)) return false;
      const c1 = (d as { content: unknown }).content;
      if (typeof c1 !== 'object' || c1 === null || !('content' in c1)) return false;
      const c2 = (c1 as { content: unknown }).content;
      return Array.isArray(c2) && c2.every(isPartyApiItem);
    };

    try {
      const res = await fetch('/api/v1/parties/my-parties?status=ongoing&page=0&size=200', {
        credentials: 'include',
      });
      if (!res.ok) return false;

      const data: unknown = await res.json().catch(() => null);

      const list: PartyApiItem[] = Array.isArray(data)
        ? (data as unknown[]).filter(isPartyApiItem)
        : hasContentArray(data)
        ? data.content
        : hasNestedContentArray(data)
        ? data.content.content
        : [];

      const ids: number[] = list.map((p) => p.id);
      return ids.some((v) => String(v) === String(partyId));
    } catch {
      return false;
    }
  };

  return (
    <article className="rounded-2xl bg-bg-card-default p-4 shadow-md border border-transparent focus:outline-none">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-basic-black">
                {title}
              </span>
              {/* Tag 컴포넌트로 카테고리 표시 */}
              <Tag variant={mapTag(category)} size="md">
                {variantToKorean(category)}
              </Tag>
            </div>
            <div className="text-sm text-gray-08">인원 {people} 명</div>
          </div>

          <p className="text-md text-gray-08 mt-2">
            시작일 : {startText || '정보 없음'}
          </p>
          <p className="text-md text-gray-08 mt-1">
            기간 : {weeks}주
          </p>

          <div className="mt-4 flex gap-3">
            <Button
              variant="detail"
              size="md"
              onClick={() => {
                // 상세(미션 계획) 페이지로 이동 (partyId 쿼리 전달)
                if (id !== undefined && id !== null) {
                  router.push(`/partyplan?partyId=${encodeURIComponent(String(id))}`);
                } else {
                  router.push('/partyplan');
                }
              }}
            >
              자세히
            </Button>
            <Button
              variant="basic"
              size="md"
              onClick={async () => {
                // 1) 먼저 참여 여부 체크
                if (id !== undefined && id !== null) {
                  const joined = await checkAlreadyJoined(id);
                  if (joined) {
                    setErrorLines(['현재 파티에 참여중입니다.', '해당 파티에서 활동을 계속하세요.']);
                    setOpenError(true);
                    return;
                  }
                }
                // 2) 그다음 정원 초과 체크
                if (isFull) {
                  setErrorLines(['인원 초과로 신청이 불가능합니다.', '다음에 다시 시도해 주세요.']);
                  setOpenError(true);
                  return;
                }
                setOpenConfirm(true);
              }}
            >
              참가신청
            </Button>
          </div>
        </div>
      </div>

      {/* 참가 확인 모달 */}
      <ConfirmModal
        open={openConfirm}
        lines={[`${title}에 참여하시겠습니까?`]}
        onCancel={() => setOpenConfirm(false)}
        onConfirm={async () => {
          setOpenConfirm(false);
          if (id) {
            // 1) 참여 여부 우선 가드
            if (await checkAlreadyJoined(id)) {
              setErrorLines(['현재 파티에 참여중입니다.', '해당 파티에서 활동을 계속하세요.']);
              setOpenError(true);
              return;
            }
            // 2) 정원 초과 가드
            if (isFull) {
              setErrorLines(['인원 초과로 신청이 불가능합니다.', '다음에 다시 시도해 주세요.']);
              setOpenError(true);
              return;
            }
            try {
              await joinPartyClient(id);
              setOpenResult(true);
            } catch (err) {
              const msg =
                (err && typeof err === 'object' && 'message' in err && typeof err.message === 'string')
                  ? err.message as string
                  : String(err);
              if (msg.includes('409') || /이미\s*(참가|참여)/.test(msg) || /ALREADY/i.test(msg)) {
                setErrorLines(['이미 참가 중인 파티입니다.', '해당 파티에서 활동을 계속하세요.']);
              } else {
                setErrorLines(['참가 신청에 실패했습니다.', '잠시 후 다시 시도해 주세요.']);
              }
              setOpenError(true);
            }
          }
        }}
        confirmText="참가신청"
        cancelText="취소"
        variant="happy"
      />

      {/* 신청 완료 안내 모달 */}
      <ConfirmModal
        open={openResult}
        lines={['참가 신청이 완료되었습니다!', '파티장의 수락을 기다려주세요.']}
        onCancel={() => setOpenResult(false)}
        onConfirm={() => setOpenResult(false)}
        confirmText="확인"
        cancelText=""
        variant="happy"
      />

      {/* 신청 실패 안내 모달 */}
      <ConfirmModal
        open={openError}
        lines={errorLines}
        onCancel={() => setOpenError(false)}
        onConfirm={() => setOpenError(false)}
        confirmText="확인"
        cancelText=""
        variant="sad"
      />
    </article>
  );
}
