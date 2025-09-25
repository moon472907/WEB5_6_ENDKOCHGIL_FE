'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IoMdArrowUp, IoMdArrowDown } from 'react-icons/io';

type Props = {
  direction: 'top' | 'bottom';
};

export default function ScrollButton({ direction }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const checkScrollable = () => {
      const scrollableHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      setVisible(scrollableHeight > clientHeight); // 스크롤 있으면 표시
    };

    checkScrollable(); // 초기 실행
    window.addEventListener('resize', checkScrollable);
    return () => window.removeEventListener('resize', checkScrollable);
  }, []);

  const handleClick = () => {
    if (direction === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={handleClick}
          aria-label={direction === 'top' ? '맨 위로 이동' : '맨 아래로 이동'}
          className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow bg-basic-white transition-colors active:scale-95`"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {direction === 'top' ? <IoMdArrowUp className="text-gray-05"/> : <IoMdArrowDown className="text-gray-05" />}
        </motion.button>
      )}
    </AnimatePresence>
  );
}
