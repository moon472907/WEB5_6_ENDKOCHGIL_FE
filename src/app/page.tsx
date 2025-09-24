'use client';

import ExperienceBar from '@/components/ui/ExperienceBar';

export default function Home() {
  // mock: 사용자 경험치
  const userCurrent = 41021310;
  const userMax = 44440002;
  // mock: 사용자 레벨 (나중에 API 값으로 대체)
  const userLevel = 2;


  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm mr-2">Lv.{userLevel}</span>
        <ExperienceBar
          current={userCurrent}
          max={userMax}
          // 툴팁 포맷은 필요하면 커스터마이즈
          formatTooltip={(c, m, p) => `${c} / ${m} (╹ڡ╹ ) ${p}%`}
        />
      </div>
    </div>
  );
}
