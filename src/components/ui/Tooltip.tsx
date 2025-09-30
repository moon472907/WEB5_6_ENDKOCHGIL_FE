'use client';

import { tw } from '@/lib/tw';
import { useState } from 'react';

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

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onClick={() => setVisible(prev => !prev)}
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
          {' '}
          {message}
        </div>
      )}
    </div>
  );
}
