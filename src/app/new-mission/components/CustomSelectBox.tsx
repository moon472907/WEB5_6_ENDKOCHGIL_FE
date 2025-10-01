'use client';

import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectBoxProps {
  options: Option[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function CustomSelectBox({
  options,
  value,
  onChange,
  placeholder = '선택해주세요',
}: CustomSelectBoxProps) {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((o) => o.value === value);

  return (
    <div className="relative w-full">
      <button
        type="button"
        className="flex w-full items-center cursor-pointer justify-between rounded-xl p-3 border-none bg-button-unselected focus:outline-none "
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={selectedOption ? 'text-stone-800' : 'text-stone-500' }>{selectedOption ? selectedOption.label : placeholder}</span>
        <FiChevronDown
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <ul className="absolute p-1 flex flex-col gap-1 z-10 mt-1 w-full rounded-lg border border-gray-200 bg-basic-white shadow-lg text-stone-800">
          {options.map((option) => (
            <li
              key={option.value}
              className={`cursor-pointer px-3 py-2 text-sm hover:bg-bg-main rounded-lg ${
                option.value === value ? 'bg-bg-main font-medium' : ''
              }`}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
