'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MdKeyboardArrowDown } from 'react-icons/md';
import ToggleContent from './ToggleContent';

interface Props {
  title: string;
  content: string;
  date: string;
  defaultOpen?: boolean;
}

export default function NoticeToggleCard({
  title,
  content,
  date,
  defaultOpen = false
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <motion.div
      initial={false}
      className="rounded-xl overflow-hidden shadow-sm has-hover:shadow-md active:shadow-md transition-shadow"
    >
      {/* 헤더 영역 */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className={`w-full p-4 text-left flex justify-between items-center transition-colors cursor-pointer
          ${
            open
              ? 'bg-button-selected text-bg-main'
              : 'bg-bg-card-default text-basic-black'
          }
        `}
      >
        <span className="text-baase font-semibold">{title}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-6 h-6"
        >
          <MdKeyboardArrowDown size={24} />
        </motion.div>
      </button>

      {/* 토글 영역 */}
      <ToggleContent open={open} className="bg-bg-card-default">
        <div className="p-5">
          <div className="text-basic-black text-sm mb-4 break-words whitespace-pre-line">{content}</div>
          <span className="block text-right text-sm font-semibold text-gray-04">
            {date}
          </span>
        </div>
      </ToggleContent>
    </motion.div>
  );
}
