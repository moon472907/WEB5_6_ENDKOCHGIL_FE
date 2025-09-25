'use client';

import { useEffect, useRef } from 'react';
import ModalPortal from './ModalPortal';
import { AnimatePresence, motion } from 'framer-motion';
import { FocusTrap } from 'focus-trap-react';

interface Props {
  isOpen: boolean;
  children: React.ReactNode;
  onClose: () => void;
}

function BaseModal({ isOpen, children, onClose }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 스크롤 잠금
    if (isOpen) {
      document.documentElement.style.setProperty(
        'overflow',
        'hidden',
        'important'
      );
    } else {
      document.documentElement.style.setProperty(
        'overflow',
        'auto',
        'important'
      );
    }

    // esc 닫기
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // 현재 모달이 최상위일 때만 닫기
        const modals = document.querySelectorAll('[data-modal="open"]');
        const topModal = modals[modals.length - 1] as HTMLElement | undefined;

        if (modalRef.current && topModal === modalRef.current) {
          onClose();
        }
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.documentElement.style.setProperty(
        'overflow',
        'auto',
        'important'
      );
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <ModalPortal>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 딤드 */}
            <motion.div
              className="fixed inset-0 z-[1000] bg-black/50"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />

            {/* 중앙 컨테이너 */}
            <div
              className="fixed inset-0 z-[1001] flex items-center justify-center px-4"
              onClick={onClose}
            >
              <FocusTrap
                active={isOpen} // 모달 열려있을 때만 활성화
                focusTrapOptions={{
                  escapeDeactivates: false, // ESC로 포커스 트랩을 해제 x (어차피 모달 onClose으로 닫혀서 해제됨)
                  allowOutsideClick: true // 바깥 클릭 허용 (바깥 클릭하면 onClick으로 꺼지게 해놨으므로)
                }}
              >
                {/* 모달 박스 */}
                <motion.div
                  ref={modalRef}
                  data-modal="open"
                  onClick={e => e.stopPropagation()}
                  className="w-full max-w-[300px] sm:max-w-[320px] rounded-xl bg-basic-white p-5"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.1 }}
                >
                  {/* 컨텐츠 */}
                  <div>{children}</div>
                </motion.div>
              </FocusTrap>
            </div>
          </>
        )}
      </AnimatePresence>
    </ModalPortal>
  );
}
export default BaseModal;
