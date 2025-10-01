'use client';

import { tw } from '@/lib/tw';

interface Props {
  tab: 'shop' | 'closet';
  setTab: (tab: 'shop' | 'closet') => void;
}

export default function TabBar({ tab, setTab }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-[600px] h-[56px] mx-auto flex bg-basic-white">
      <div className="w-1/2 flex items-center justify-center pl-5 pr-2.5 py-2">
        <button
          className={tw(
            'w-full h-full rounded-full text-base font-semibold cursor-pointer transition-colors',
            tab === 'shop'
              ? 'bg-button-selected text-bg-main'
              : 'bg-bg-main text-text-store-button'
          )}
          onClick={() => setTab('shop')}
        >
          상점
        </button>
      </div>

      <div className="w-1/2 flex items-center justify-center pl-2.5 pr-5 py-2">
        <button
          className={tw(
            'w-full h-full rounded-full text-base font-semibold cursor-pointer transition-colors',
            tab === 'closet'
              ? 'bg-button-selected text-bg-main'
              : 'bg-bg-main text-text-store-button'
          )}
          onClick={() => setTab('closet')}
        >
          옷장
        </button>
      </div>
    </nav>
  );
}
