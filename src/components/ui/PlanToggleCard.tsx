'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MdKeyboardArrowDown } from 'react-icons/md';
import ToggleContent from './ToggleContent';
import { tw } from '@/lib/tw';

interface Props {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export default function PlanToggleCard({
  title,
  children,
  defaultOpen = false,
  className = ''
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="w-full">
      {/* 헤더 영역 */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="w-full flex items-center justify-between py-3 cursor-pointer"
      >
        <span className="text-lg font-bold text-gray-09">{title}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-6 h-6 text-gray-09"
        >
          <MdKeyboardArrowDown size={24} />
        </motion.div>
      </button>

      {/* 토글 영역 */}
      <ToggleContent open={open}>
        <div className={tw('pb-3', className)}>{children}</div>
      </ToggleContent>
    </div>
  );
}
