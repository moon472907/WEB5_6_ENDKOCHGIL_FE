'use client';

import ContentWrapper from "@/components/layout/ContentWrapper";
import Toggle from "@/components/ui/Toggle";
import Header from "@/components/layout/Header";
import { useState } from "react";
import { MdPersonOutline, MdStars } from "react-icons/md";
import AlertModal from "@/components/modal/AlertModal";
import SettingButton from "@/app/(with-nav)/settings/components/SettingButton";
import { equipTitle, unequipTitle } from "@/lib/api/title";
import { useRouter } from "next/navigation";

interface Title {
  id: number;
  name: string;
  condition: string;
  description: string;
  locked: boolean;
}

interface Props {
  currentTitle?: string;
  allTitles: Title[];
  accessToken: string;
}

export default function TitleClient({ currentTitle, allTitles, accessToken }: Props) {
  const router = useRouter();

  const [checked, setChecked] = useState(false);  // 토글 상태 관리
  const [equipOpen, setEquipOpen] = useState(false); // 장착 모달 상태 관리
  const [unequipOpen, setUnequipOpen] = useState(false); // 해제 모달 상태 관리
  const [selectedTitle, setSelectedTitle] = useState<Title | null>(null);  // 칭호 상태 관리
  const [appliedTitle, setAppliedTitle] = useState(currentTitle ?? ""); // 현재 적용 중인 칭호 상태 관리

  const ownedTitles = allTitles.filter((t) => !t.locked); // 보유 중인 칭호만 필터링
  const displayed = checked ? allTitles : ownedTitles; // 토글 상태에 따라 전체/보유 칭호 표시

  // 장착 핸들러
  const handleConfirm = async () => {
    if (!selectedTitle) return;

    // 이미 장착 중인 칭호인지 확인
    if (selectedTitle.name === appliedTitle) {
      alert("이미 장착 중인 칭호입니다!");
      setEquipOpen(false);
      return;
    }

    try {
      await equipTitle(accessToken, selectedTitle.id);
      setAppliedTitle(selectedTitle.name);
      alert("칭호가 장착되었습니다!");
      router.refresh(); 
    } catch {
      alert("칭호 장착에 실패했습니다.");
    } finally {
      setEquipOpen(false);
    }
  };

  // 해제 핸들러
  const handleUnequip = async () => {
    try {
      await unequipTitle(accessToken);
      setAppliedTitle("");
      alert("칭호가 해제되었습니다!");
      router.refresh();
    } catch {
      alert("칭호 해제에 실패했습니다.");
    } finally {
      setUnequipOpen(false);
    }
  };

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
          <SettingButton
            onClick={() => {
              if (appliedTitle) setUnequipOpen(true); // 해제 모달
            }}
          >
            {appliedTitle || "칭호 없음"}
          </SettingButton>
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

          {/* 칭호 */}
          <div className="flex flex-col gap-2.5">
            {displayed.map((title) => (
              <SettingButton
                key={title.id}
                locked={title.locked}
                onClick={() => {
                  setSelectedTitle(title);
                  setEquipOpen(true);
                }}
              >
                {title.name}
              </SettingButton>
            ))}
          </div>
        </div>

        {/* 모달 영역 */}

        {/* 장착 모달 */}
        {selectedTitle && (
          <AlertModal
            open={equipOpen}
            onConfirm={handleConfirm}
            onCancel={() => {
              setEquipOpen(false);
              setSelectedTitle(null);
            }}
            title={selectedTitle.name}
            description={`획득 조건: ${selectedTitle.condition}`}
            detail={selectedTitle.description}
            confirmText="장착"
            disabled={selectedTitle.locked}
            disabledMessage="칭호를 획득해야 적용할 수 있습니다."
          />
        )}

        {/* 해제 모달 */}
        <AlertModal
          open={unequipOpen}
          onConfirm={handleUnequip}
          onCancel={() => setUnequipOpen(false)}
          title="칭호 해제"
          detail="현재 장착된 칭호를 해제하시겠습니까?"
          confirmText="해제"
        />
      </ContentWrapper>
    </>
  );
}
