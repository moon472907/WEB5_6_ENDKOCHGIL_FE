'use client';

import { FaCheck } from 'react-icons/fa6';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export default function Checkbox({
  label,
  checked,
  onChange,
  disabled = false,
}: CheckboxProps) {
  const handleClick = () => {
    if (disabled) return;
    onChange(!checked);
  };

  return (
    <label
      className={`inline-flex items-center gap-2 cursor-pointer select-none ${
        disabled ? 'opacity-60 cursor-not-allowed' : ''
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={handleClick}
        className="hidden"
        readOnly
        disabled={disabled}
      />
      <span
        className={`w-5 h-5 flex items-center justify-center rounded 
          ${checked ? 'bg-orange-main text-basic-white' : 'border-2 border-gray-06'}
        `}
      >
        {checked && <FaCheck />}
      </span>
      <span className={`text-gray-07 ${checked ? 'line-through' : ''}`}>{label}</span>
    </label>
  );
}
