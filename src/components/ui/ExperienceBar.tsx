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
    formatTooltip?.(safeCurrent, safeMax, pct) ?? `${safeCurrent} / ${safeMax} · ${pct}%`;

  return (
    <div className={`relative w-full ${className} group`} aria-hidden={false}>

    </div>
  );
}
