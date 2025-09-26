'use client';

import { tw } from '@/lib/tw';
import { AnimatePresence, motion } from 'framer-motion';

interface ToggleContentProps {
  open: boolean;
  children: React.ReactNode;
  className?: string;
}

export default function ToggleContent({
  open,
  children,
  className
}: ToggleContentProps) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={tw('overflow-hidden', className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
