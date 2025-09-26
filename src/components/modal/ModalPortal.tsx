'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  children: React.ReactNode;
}

function ModalPortal({ children }: Props) {
  const [mounted, setMounted] = useState(false);
  const [el, setEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
    setEl(document.getElementById('modal-root'));
  }, []);

  if (!mounted || !el) return null;
  return createPortal(children, el);
}
export default ModalPortal;
