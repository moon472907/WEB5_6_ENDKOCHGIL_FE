'use client';

import Image from 'next/image';

export default function EmptyMissionCard() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 bg-basic-white rounded-3xl shadow-md px-6 py-10 text-center">
      <Image
        src="/images/sad-nuts.png"
        alt="미션 없음"
        width={80}
        height={80}
      />
      <div className="flex flex-col gap-2">
        <p className="text-lg font-semibold text-gray-08">
          오늘에 해당하는 미션이 없어요!
        </p>
        <p className="text-sm text-gray-05">
          다양한 보상을 얻을 수 있는 미션에 참여해보세요 ✨
        </p>
      </div>
    </div>
  );
}
