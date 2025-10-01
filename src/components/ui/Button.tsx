'use client';

import React, { useState } from 'react';
import { tw } from '@/lib/tw';

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
      onMouseLeave={() => setPressed(false)}
      disabled={disabled}
      className={tw(
        'inline-flex items-center justify-center rounded-xl font-medium shadow-sm transition-colors cursor-pointer',
        sizeStyles[size],
        fullWidth && 'w-full',
        className,

        disabled && 'bg-[var(--color-gray-03)] text-[var(--color-gray-07)] cursor-not-allowed',

        !disabled && variant === 'basic' && [
          'bg-[var(--color-button-selected)] text-[var(--color-basic-white)]',
          'has-hover:bg-[var(--color-button-hover)]',
          pressed && 'bg-[var(--color-button-active)]'
        ],

        !disabled && variant === 'unselected' && [
          'bg-[var(--color-button-unselected)] text-[var(--color-button-point)]',
          'has-hover:bg-[var(--color-button-hover)] has-hover:text-[var(--color-basic-white)]',
          pressed && 'bg-[var(--color-button-selected)] text-[var(--color-gray-01)]'
        ],

        !disabled && variant === 'active' && [
          'bg-[var(--color-button-active)] text-[var(--color-basic-white)]',
          pressed && 'bg-[var(--color-button-active)]'
        ],

        !disabled && variant === 'point' && [
          'bg-[var(--color-button-point)] text-[var(--color-basic-white)]',
          pressed && 'bg-[var(--color-button-active)]'
        ],

        !disabled && variant === 'detail' && [
          'bg-[var(--color-basic-white)] text-[var(--color-basic-black)]',
          'has-hover:bg-[var(--color-gray-03)]',
          pressed && 'bg-[var(--color-gray-03)]'
        ],

        !disabled && variant === 'cancel' && [
          'bg-[var(--color-gray-01)] text-[var(--color-button-selected)] border border-[var(--color-button-selected)]',
          'has-hover:bg-[var(--color-gray-03)]',
          pressed && 'bg-[var(--color-gray-03)]'
        ]
      )}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
}
