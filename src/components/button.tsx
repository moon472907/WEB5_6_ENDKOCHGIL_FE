'use client';

import React, { useState } from 'react';

type Variant =
  | 'basic'
  | 'unselected'
  | 'disabled'
  | 'detail'
  | 'cancel';
type Size = 'sm' | 'md' | 'lg';
type ButtonState = 'default' | 'hover' | 'active';

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

type StyleSet = {
  bg: string;
  text: string;
  border?: string;
};

const variantVarMap: Record<Variant, Record<ButtonState, StyleSet>> = {
  basic: {
    default: {
      bg: 'var(--color-button-selected)',
      text: 'var(--color-basic-white)'
    },
    hover: {
      bg: 'var(--color-button-hover-basic)',
      text: 'var(--color-basic-white)'
    },
    active: {
      bg: 'var(--color-button-active)',
      text: 'var(--color-basic-white)'
    }
  },
  unselected: {
    default: {
      bg: 'var(--color-button-unselected)',
      text: 'var(--color-button-point)'
    },
    hover: {
      bg: 'var(--color-button-hover-unselected)',
      text: 'var(--color-button-point)'
    },
    active: {
      bg: 'var(--color-button-active)',
      text: 'var(--color-basic-white)'
    }
  },
  disabled: {
    default: {
      bg: 'var(--color-button-disabled)',
      text: 'var(--color-gray-07)'
    },
    hover: {
      bg: 'var(--color-button-disabled)',
      text: 'var(--color-gray-07)'
    },
    active: {
      bg: 'var(--color-button-disabled)',
      text: 'var(--color-gray-07)'
    }
  },
  detail: {
    default: {
      bg: 'var(--color-basic-white)',
      text: 'var(--color-basic-black)'
    },
    hover: {
      bg: 'var(--color-button-hover-detail)',
      text: 'var(--color-basic-black)'
    },
    active: { bg: 'var(--color-gray-02)', text: 'var(--color-basic-black)' }
  },
  cancel: {
    default: {
      bg: 'var(--color-basic-white)',
      text: 'var(--color-button-point)',
      border: '1px solid var(--color-button-point)'
    },
    hover: {
      bg: 'var(--color-button-hover-cancel)',
      text: 'var(--color-button-point)',
      border: '1px solid var(--color-button-point)'
    },
    active: {
      bg: 'var(--color-gray-02)',
      text: 'var(--color-basic-black)',
      border: '1px solid var(--color-button-point)'
    }
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
  const [state, setState] = useState<ButtonState>('default');

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    onClick?.(e);
  };

  const styleSet = variantVarMap[variant][state];

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      onMouseEnter={() => setState('hover')}
      onMouseLeave={() => setState('default')}
      onMouseDown={() => setState('active')}
      onMouseUp={() => setState('hover')}
      className={`inline-flex items-center justify-center rounded-md font-medium shadow-sm ${sizeStyles[size]} ${className}`}
      style={{
        backgroundColor: styleSet.bg,
        color: styleSet.text,
        border: styleSet.border ?? 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        width: fullWidth ? '100%' : 'auto'
      }}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
