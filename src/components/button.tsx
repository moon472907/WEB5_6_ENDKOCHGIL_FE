import React from 'react';

type Variant = 'selected' | 'unselected' | 'disabled' | 'active' | 'point';
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
  md: 'text-base px-4 py-2',
  lg: 'text-lg px-5 py-3'
};

const variantVarMap: Record<Variant, { bgVar: string; textColor: string }> = {
  selected: { bgVar: '--color-button-selected', textColor: '#ffffff' },
  unselected: {
    bgVar: '--color-button-unselected',
    textColor: '--color-button-point'
  },
  disabled: { bgVar: '--color-button-disabled', textColor: '#5E5E5E' },
  active: { bgVar: '--color-button-active', textColor: '#ffffff' },
  point: { bgVar: '--color-button-point', textColor: '#ffffff' }
};

function Button({
  children,
  variant,
  size = 'lg',
  disabled,
  fullWidth = false,
  className,
  onClick,
  type
}: ButtonProps) {

  const { bgVar, textColor } = variantVarMap[variant];
  const bgValue = `var(${bgVar}, ${
    variant === 'unselected' ? '#cfc8ba' : '#68513a'
  })`;
  const disabledBgColor = 'var(--color-button-disabled)';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-md font-medium shadow-sm ${sizeStyles[size]} ${className}`}
      style={{
        backgroundColor: disabled ? disabledBgColor : bgValue,
        color: textColor,
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
