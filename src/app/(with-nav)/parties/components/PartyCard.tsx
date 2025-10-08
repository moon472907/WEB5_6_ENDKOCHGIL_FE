'use client';

import Button from '@/components/ui/Button';
import Tag from '@/components/ui/Tag';
import ConfirmModal from '@/components/modal/ConfirmModal';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mapTag, variantToKorean } from '@/lib/tag';
import type { PartyApiItem } from '@/lib/api/parties/parties';

export default function PartyCard({
  category,
  title,
  startAt,
  endAt,
  people,
  id
}: {
  category?: PartyApiItem['category'];
  isPublic?: boolean;
  title: string;
  startAt?: string;
  endAt?: string;
  people?: string;
  id?: number | string;
}) {
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
  const router = useRouter();

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
            <Button variant="detail" size="md">
              자세히
            </Button>
            <Button
              variant="basic"
              size="md"
              onClick={() => setOpenConfirm(true)}
            >
              참여하기
            </Button>
          </div>
        </div>
      </div>

      {/* 참여 확인 모달 */}
      <ConfirmModal
        open={openConfirm}
        lines={[`${title}에 참여하시겠습니까?`]}
        onCancel={() => setOpenConfirm(false)}
        onConfirm={() => {
          setOpenConfirm(false);
          // id가 있으면 /parties/:id, 없으면 title 기반 슬러그로 이동
          if (id) {
            router.push(`/partydetail/${id}`);
          } else {
            router.push(`/partydetail/${encodeURIComponent(title)}`);
          }
        }}
        confirmText="참여하기"
        cancelText="취소"
        variant="happy"
      />
    </article>
  );
}
