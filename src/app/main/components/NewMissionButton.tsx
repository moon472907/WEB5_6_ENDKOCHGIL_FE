'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function NewMissionButton() {
  const router = useRouter();

  return (
    <div className="fixed bottom-40 right-10 inset-x-0 flex justify-center">
      <div className="relative w-full max-w-[600px] px-4">
        <button
          type="button"
          className="absolute right-0 flex items-center justify-center w-14 h-14 rounded-full shadow-[0_8px_6px_0_rgba(0,0,0,0.25)] bg-button-point has-hover:bg-button-active active:bg-button-active active:scale-98 transition-colors cursor-pointer"
          onClick={() => router.push('/new-mission')}
        >
          <Image
            src="/images/mission-plus.png"
            alt="미션 추가"
            width={30}
            height={30}
          />
        </button>
      </div>
    </div>
  );
}
