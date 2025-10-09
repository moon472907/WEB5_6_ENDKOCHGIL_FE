'use client';

import { useEffect, useState } from 'react';
import { FaCheck } from 'react-icons/fa6';

interface CheckboxProps {
  label: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

export default function Checkbox({
  label,
  defaultChecked = false,
  onChange
}: CheckboxProps) {
  const [checked, setChecked] = useState(defaultChecked);


  // 부모에서 defaultChecked가 바뀔 경우에도 반영되도록
    useEffect(() => {
    setChecked(defaultChecked);
  }, [defaultChecked]);


  const handleChange = () => {
    const next = !checked;
    setChecked(next);
    onChange?.(next); // 부모 콜백 실행
  };

  return (
    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className="hidden peer"
      />
      <span
        className={`w-5 h-5 flex items-center justify-center 
               rounded  
               ${checked ? '' : 'border-2 border-gray-06'}  
               peer-checked:bg-orange-main peer-checked:text-basic-white`}
      >
        {checked && <FaCheck />}
      </span>
      <span className="text-gray-07 peer-checked:line-through">{label}</span>
    </label>
  );
}
