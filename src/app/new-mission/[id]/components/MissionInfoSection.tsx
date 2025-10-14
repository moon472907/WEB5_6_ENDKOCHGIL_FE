'use client';

import Tooltip from '@/components/ui/Tooltip';
import { MdInfoOutline } from 'react-icons/md';

export default function MissionInfoSection() {
  return (
    <section className="flex flex-col">
      <div className="flex gap-1 items-center">
        <p className="text-gray-09 font-bold text-lg">AI 생성 계획</p>
        <Tooltip
          message={
            <>
              미션은 일주일 단위로 공개됩니다
              <br />
              다음 주까지의 계획을 수정할 수 있습니다
            </>
          }
          position="bottom"
        >
          <MdInfoOutline
            size={20}
            className="text-orange-main cursor-pointer"
          />
        </Tooltip>
      </div>
      <p className="text-gray-04 font-semibold text-sm">
        미션 계획이 생성되었습니다
        <br />
        새로운 미션은 항상 월요일부터 시작됩니다
      </p>
    </section>
  );
}
