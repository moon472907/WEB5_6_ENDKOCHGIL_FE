'use client';

import { tw } from '@/lib/tw';
import { useRouter } from 'next/navigation';
import { MdKeyboardArrowLeft } from "react-icons/md";

type Props = {
  title?: string;
  bgColor?: 'main'|'white';
};

function Header({ title, bgColor = 'main' }: Props) {
  const router = useRouter();

  return (
    <header className={tw("sticky top-0 z-50", bgColor === 'main' ? 'bg-bg-main' : 'bg-basic-white')}>
      <div className="relative h-14 flex items-center justify-center">
        <button
          type="button"
          aria-label="뒤로가기"
          onClick={() => router.back()}
          className="absolute left-4 hover:cursor-pointer text-basic-black"
        >
          <MdKeyboardArrowLeft size={28}/>
        </button>
        {title && (
          <h1 className="text-center text-lg font-semibold">{title}</h1>
        )}
      </div>
    </header>
  );
}
export default Header;
