'use client';

import React from 'react';

type Variant =
  | 'basic'
  | 'unselected'
  | 'disabled'
  | 'active'
  | 'point'
  | 'detail'
  | 'cancel';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  variant: Variant;
  size: Size;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit';
}

const sizeStyles = {
  sm: 'text-sm px-3 py-1',
  md: 'text-md px-4 py-2',
  lg: 'text-lg px-5 py-3'
};

const variantVarMap: Record<
  Variant,
  { bgVar: string; textColor: string; border?: string }
> = {
  basic: { bgVar: '--color-button-selected', textColor: '#f9f9f9' },
  unselected: {
    bgVar: '--color-button-unselected',
    textColor: '#473535'
  },
  disabled: { bgVar: '--color-button-disabled', textColor: '#5e5e5e' },
  active: { bgVar: '--color-button-active', textColor: '#f9f9f9' },
  point: { bgVar: '--color-button-point', textColor: '#f9f9f9' },
  detail: { bgVar: '--color-basic-white', textColor: '#1a1a1a' },
  cancel: {
    bgVar: '--color-basic-white',
    textColor: '#473535',
    border: '1px solid #473535'
  }
};

function Button({
  children,
  variant = 'basic',
  size = 'lg',
  disabled,
  fullWidth = false,
  className,
  onClick,
  type
}: ButtonProps) {

  const { bgVar, textColor, border } = variantVarMap[variant];
  const bgValue = `var(${bgVar}, ${variant === 'unselected' ? '#cfc8ba' : '#68513a'})`;
  const disabledBgColor = 'var(--color-button-disabled)';

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    onClick?.(e);
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-md font-medium shadow-sm ${sizeStyles[size]} ${className}`}
      style={{
        backgroundColor: disabled ? disabledBgColor : bgValue,
        color: textColor,
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
export default Button;
