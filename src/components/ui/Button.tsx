'use client';

import React, { useState } from 'react';

type Variant = 'basic' | 'unselected' | 'disabled' | 'active' | 'point' | 'detail' | 'cancel';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit';
}

const sizeStyles = { sm: 'text-sm px-3 py-1', md: 'text-md px-4 py-2', lg: 'text-lg px-5 py-3' };

// 기본 변수 매핑 (bg / text)
const VARIANT_MAP: Record<Variant, { bgVar: string; textVar: string; border?: string }> = {
  basic: { bgVar: '--color-button-selected', textVar: '--color-basic-white' },
  unselected: { bgVar: '--color-button-unselected', textVar: '--color-button-point' },
  disabled: { bgVar: '--color-gray-07', textVar: '--color-gray-07' },
  active: { bgVar: '--color-button-active', textVar: '--color-basic-white' },
  point: { bgVar: '--color-button-point', textVar: '--color-basic-white' },
  detail: { bgVar: '--color-basic-white', textVar: '--color-basic-black' },
  cancel: { bgVar: '--color-gray-01', textVar: '--color-button-selected', border: '1px solid var(--color-button-selected)' }
};

// 눌렀을 때 적용할 배경
const PRESSED_BG_MAP: Record<Variant, string | undefined> = {
  basic: '--color-button-selected',
  unselected: '--color-button-selected',
  disabled: undefined,
  active: '--color-button-active',
  point: '--color-button-active',
  detail: '--color-gray-03',
  cancel: '--color-gray-03'
};

// 눌렀을 때 텍스트 색상
const PRESSED_TEXT_MAP: Record<Variant, string | undefined> = {
  basic: undefined,
  unselected: '--color-gray-01',
  disabled: undefined,
  active: undefined,
  point: undefined,
  detail: undefined,
  cancel: undefined
};

// hover 배경
const HOVER_BG_MAP: Record<Variant, string | undefined> = {
  basic: '#AF8B67',
  unselected: '#AF8B67',
  disabled: undefined,
  active: undefined,
  point: undefined,
  detail: '--color-gray-03',
  cancel: '--color-gray-03'
};

// hover 때 텍스트 색상
const HOVER_TEXT_MAP: Record<Variant, string | undefined> = {
  basic: undefined,
  unselected: '--color-basic-white',
  disabled: undefined,
  active: undefined,
  point: undefined,
  detail: undefined,
  cancel: undefined
};


function toCssValue(v?: string) {
  if (!v) return undefined;
  return v.startsWith('--') ? `var(${v})` : v;
}

export default function Button({
  children,
  variant = 'basic',
  size = 'lg',
  disabled,
  fullWidth = false,
  className,
  onClick,
  type = 'button'
}: ButtonProps) {
  const [pressed, setPressed] = useState(false);
  const [hover, setHover] = useState(false);

  const { bgVar, textVar, border } = VARIANT_MAP[variant];
  const bgValue = toCssValue(bgVar);
  const textValue = toCssValue(textVar);
  const disabledBg = toCssValue('--color-gray-03');
  const disabledText = toCssValue('--color-gray-07');

  const pressedBg = toCssValue(PRESSED_BG_MAP[variant]);
  const pressedText = toCssValue(PRESSED_TEXT_MAP[variant]);
  const hoverBg = toCssValue(HOVER_BG_MAP[variant]);
  const hoverText = toCssValue(HOVER_TEXT_MAP[variant]);

  const resolvedBg = disabled
    ? disabledBg
    : pressed
    ? (pressedBg ?? toCssValue('--color-button-active'))
    : hover && hoverBg
    ? hoverBg
    : bgValue;

  const resolvedColor = disabled
    ? disabledText
    : (pressed && pressedText)
    ? pressedText
    : (hover && hoverText)
    ? hoverText
    : textValue;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    onClick?.(e);
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => {
        setPressed(false);
        setHover(false);
      }}
      onMouseEnter={() => setHover(true)}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-xl font-medium shadow-sm ${sizeStyles[size]} ${className ?? ''}`}
      style={{
        backgroundColor: resolvedBg,
        color: resolvedColor,
        cursor: disabled ? 'not-allowed' : 'pointer',
        width: fullWidth ? '100%' : 'auto',
        border: border ?? 'none'
      }}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
}
