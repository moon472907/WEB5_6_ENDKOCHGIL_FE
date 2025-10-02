'use client'

import ContentWrapper from "@/components/layout/ContentWrapper";
import Header from "@/components/layout/Header";
import Toggle from "@/components/ui/Toggle";
import { useState } from "react";
import { MdPersonOutline, MdStars } from "react-icons/md";
import { mockTitles } from "./titles";

import AlertModal from "@/components/modal/AlertModal";
import SettingButton from "@/app/(with-nav)/settings/components/SettingButton";

export default function Page() {
  const [checked, setChecked] = useState(false); // 토글 상태 관리
  const [alertOpen, setAlertOpen] = useState(false); // 모달 상태 관리
  const [selectedTitle, setSelectedTitle] = useState<typeof mockTitles[0] | null>(null); // 칭호 상태 관리

  return (
    <>
      <Header title="칭호 수정" />
      <ContentWrapper withNav padding="xl">

        {/* 현재 칭호 영역 */}
        <div className="mb-6">
          <div className="flex items-center gap-1 mb-2">
            <MdPersonOutline size={20} className="text-button-point" />
            <span className="text-base font-semibold text-button-point">현재 칭호</span>
          </div>
          <div className="flex flex-col gap-2.5">
            <SettingButton>
              무작위 총력전의 신
            </SettingButton>
          </div>
        </div>

        {/* 칭호 영역 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <MdStars size={20} className="text-button-point" />
              <span className="text-base font-semibold text-button-point">칭호</span>
            </div>
            <Toggle
              checked={checked}
              onChange={setChecked}
              leftLabel="전체 보기"
            />
          </div>

          {/* 칭호 (목 데이터) */}
          <div className="flex flex-col gap-2.5">
            {(checked ? mockTitles : mockTitles.filter((t) => !t.locked)).map(
              (title) => (
                <SettingButton
                  key={title.id}
                  locked={title.locked}
                  onClick={()=>{setSelectedTitle(title)
                  setAlertOpen(true)
                  }}
                >
                  {title.name}
                </SettingButton>
              )
            )}
          </div>
        </div>

        {/* 모달 영역 */}
        {selectedTitle && (
          <AlertModal
            open={alertOpen}
            onConfirm={()=> {
              // console.log("적용 버튼 눌림")
              setAlertOpen(false)
            }}
            title={selectedTitle.name}
            description={`획득 조건: ${selectedTitle.condition}`}
            detail={selectedTitle.description}
            disabled={selectedTitle.locked}
            disabledMessage="이 칭호를 획득해야 적용할 수 있습니다"
          />
        )}


      </ContentWrapper>
    </>
  );
}
