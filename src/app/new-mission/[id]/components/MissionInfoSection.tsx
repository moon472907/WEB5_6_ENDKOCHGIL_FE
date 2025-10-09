'use client';

import Tooltip from '@/components/ui/Tooltip';
import Image from 'next/image';

export default function MissionInfoSection() {
  return (
    <section className="flex flex-col">
      <div className="flex gap-1 items-center">
        <p className="text-gray-09 font-bold text-lg">AI 생성 계획</p>
        <Tooltip
          message={
            <>
              미션은 일주일 전에 생성됩니다
              <br />
              다음주까지의 계획을 수정할 수 있습니다
            </>
          }
          position="bottom"
        >
          <Image
            src="/images/info.png"
            alt="생성 계획 도움말"
            width={20}
            height={20}
            className="w-[20px] h-[20px] object-contain cursor-pointer"
          />
        </Tooltip>
      </div>
      <p className="text-gray-04 font-semibold text-sm">미션 계획이 생성되었어요</p>
    </section>
  );
}
