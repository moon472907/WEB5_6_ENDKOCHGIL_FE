'use client';

import { useRouter } from 'next/navigation';

type Props = {
  title?: string;
};

function Header({ title }: Props) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 bg-bg-main">
      <div className="relative h-14 flex items-center justify-center">
        <button
          type="button"
          aria-label="뒤로가기"
          onClick={() => router.back()}
          className="absolute left-4 hover:cursor-pointer"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-basic-black"
          >
            <path d="M15 6L9 12L15 18" stroke="currentColor" />
          </svg>
        </button>
        {title && (
          <h1 className="text-center text-lg font-semibold">{title}</h1>
        )}
      </div>
    </header>
  );
}
export default Header;
