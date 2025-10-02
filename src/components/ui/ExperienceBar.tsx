'use client'

import { tw } from '@/lib/tw';
import React, { useEffect, useState } from 'react';

type Props = {
  current: number;
  max: number;
  height?: number; // px
  className?: string;
  // tooltip 형식 커스터마이즈 가능 (기본: "current / max (pct%)")
  formatTooltip?: (current: number, max: number, pct: number) => string;
};

export default function ExperienceBar({
  current,
  max,
  height = 10,
  className = '',
  formatTooltip
}: Props) {
  const safeMax = Math.max(1, Math.floor(max));
  const safeCurrent = Math.max(0, Math.min(safeMax, Math.floor(current)));
  const pct = Math.round((safeCurrent / safeMax) * 100);

  const tooltipText =
    formatTooltip?.(safeCurrent, safeMax, pct) ?? `${safeCurrent} / ${safeMax} (${pct}%)`;

  const [tooltipOpen, setTooltipOpen] = useState(false); // 모바일 표시 상태 관리
  useEffect(() => { // 2초 후 자동 닫힘
    if (tooltipOpen) {
      const t = setTimeout(() => setTooltipOpen(false), 2000);
      return () => clearTimeout(t);
    }
  }, [tooltipOpen]);

  const [isTouchDevice, setIsTouchDevice] = useState(false); // 모바일 감지 상태
  useEffect(() => {
    const mql = window.matchMedia('(hover: none), (pointer: coarse)');
    setIsTouchDevice(mql.matches);
  }, []);

  return (
    <div className={`relative w-full ${className}`} aria-hidden={false} onClick={isTouchDevice ? () => setTooltipOpen(true) : undefined}>
      {/* 바 배경 */}
      <div
        className="w-full rounded-full bg-[var(--color-button-point)] overflow-hidden"
        style={{ height }}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={safeCurrent}
      >
        {/* 채움 */}
        <div
          className="h-full rounded-full bg-[var(--color-orange-main)] transition-all duration-150"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* 툴팁: 호버 시 보임 (데스크탑), 클릭 시 보임 (모바일) */}
      <div
        className={tw(
          'pointer-events-none absolute left-1/2 -translate-x-1/2 -bottom-8 rounded-md',
          'bg-[var(--color-basic-white)] text-[var(--color-basic-black)] text-xs px-2 py-1 shadow-sm',
          'transition-opacity duration-300',
          tooltipOpen ? 'opacity-100' : 'opacity-0 group-has-hover:opacity-100'
        )}
        style={{ whiteSpace: 'nowrap' }}
        aria-hidden="true"
      >
        {tooltipText}
      </div>
    </div>
  );
}
