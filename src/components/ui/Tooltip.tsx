'use client';

import { tw } from '@/lib/tw';
import { useState, useEffect, useRef } from 'react';

interface TooltipProps {
  message: React.ReactNode;
  position?: 'top' | 'bottom';
  children: React.ReactNode;
}

export default function Tooltip({
  message,
  position = 'top',
  children
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setVisible(false);
      }
    }

    if (visible) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [visible]);

  return (
    <div
      ref={ref}
      className="relative inline-block"
      onClick={() => setVisible(true)}
    >
      {children}
      {visible && (
        <div
          className={tw(
            'absolute -translate-x-2 whitespace-nowrap',
            'rounded-xl bg-basic-white text-button-point text-sm font-semibold p-3',
            'shadow-[0_4px_4px_rgba(0,0,0,0.25)]',
            'max-w-[80vw] break-words',
            position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
          )}
        >
          {message}
        </div>
      )}
    </div>
  );
}
