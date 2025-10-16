'use client';

import { useEffect } from 'react';

/**
 * ref 영역 밖을 클릭했을 때 콜백을 실행하는 훅
 * @param ref 감시할 DOM 영역
 * @param handler 외부 클릭 시 실행할 콜백
 * @param enabled (선택) true일 때만 이벤트 감지 (기본값 true)
 */
export default function useOutsideClick<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  handler: (event: MouseEvent) => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler, enabled]);
}
