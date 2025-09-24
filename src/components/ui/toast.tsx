'use client';

import Image from 'next/image';
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  message: string;
  open: boolean;
  onClose: () => void;
  duration?: number; // ms 단위, 기본값 3000ms
  fullWidth?: boolean;
  className?: string;
}

export default function Toast({ message, open, onClose, duration = 3000, fullWidth = false, className = '' }: ToastProps) {
  useEffect(() => {
    if (!open) return;
    const time = setTimeout(onClose, duration);
    return () => clearTimeout(time);
  }, [open, onClose, duration]);

  const containerStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-button-point)',
    color: '#ffffff',
    width: fullWidth ? 'calc(100% - 32px)' : 'auto',
    maxWidth: fullWidth ? '560px' : undefined,
    cursor: 'pointer' // 탭으로 닫기 가능하다는 시각적 힌트
  };

  // 드래그 종료 시 아래로 충분히 스와이프했으면 닫기
  const handleDragEnd = (_: unknown, info: { offset: { y: number }; velocity: { y: number } }) => {
    if (info.offset.y > 40 || info.velocity.y > 300) {
      onClose();
    }
  };

  return (
    <AnimatePresence> {/* exit 애니메이션 */}
      {open && (
        <motion.div
          role="status"
          aria-live="polite"
          aria-label="토스트 알림, 탭하면 닫힙니다"
          initial={{ opacity: 0, y: 16 }} // 시작 위치
          animate={{ opacity: 1, y: 0 }} // 애니메이션 위치
          exit={{ opacity: 0, y: 16 }}  // 종료 위치
          transition={{ duration: 0.24 }} // 애니메이션 시간
          className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-lg px-4 py-2 ${className}`}
          style={containerStyle}
          onClick={() => onClose()}            // 탭으로 닫기
          drag="y"                            // 세로 드래그 허용
          dragConstraints={{ top: 0, bottom: 0 }}
          onDragEnd={handleDragEnd}           // 스와이프 거리/속도로 닫기 판단
        >
          <Image src="/check_icon.svg" alt="Check icon" width={24} height={24} />
          <span className="text-sm">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
