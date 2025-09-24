import React from 'react';

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

  return (
    <div className={`relative w-full ${className} group`} aria-hidden={false}>
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
          className="h-full bg-[var(--color-orange-main)] transition-all duration-150"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* 툴팁: 호버 시 보임 (데스크탑) */}
      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 -bottom-8 rounded-md bg-[var(--color-basic-white)] text-[var(--color-basic-black)] text-xs px-2 py-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        style={{ whiteSpace: 'nowrap' }}
        aria-hidden="true"
      >
        {tooltipText}
      </div>
    </div>
  );
}
