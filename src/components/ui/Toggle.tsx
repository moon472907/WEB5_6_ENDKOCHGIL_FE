'use client';

import { tw } from '@/lib/tw';

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
  leftLabel?: string;
  rightLabel?: string;
  className?: string;
}

function Toggle({ checked, onChange, leftLabel, rightLabel, className }: Props) {
  const ariaLabel =
    leftLabel && rightLabel
      ? `${leftLabel} ${rightLabel} 토글 버튼`
      : '토글 버튼';

  return (
    <div className={tw("inline-flex items-center gap-3", className)}>
      {leftLabel && (
        <span className="flex items-center text-base font-semibold text-button-point transition-colors">
          {leftLabel}
        </span>
      )}

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel}
        onClick={() => onChange(!checked)}
        className={tw(
          'relative w-[42px] h-[22px] rounded-full border-none p-0 cursor-pointer transition-colors',
          checked ? 'bg-orange-main' : 'bg-gray-03'
        )}
      >
        <span
          className={tw(
            'absolute top-[2px] left-[2px] w-[18px] h-[18px] bg-basic-white rounded-full shadow transition-transform',
            checked ? 'translate-x-[20px]' : 'translate-x-0'
          )}
        />
      </button>

      {rightLabel && (
        <span
          className={tw(
            'flex items-center text-base font-semibold text-button-point transition-colors',
            checked && 'text-orange-main font-bold'
          )}
        >
          {rightLabel}
        </span>
      )}
    </div>
  );
}
export default Toggle;
