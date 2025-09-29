import ContentWrapper from "@/components/layout/ContentWrapper";
import Button from "@/components/ui/Button";
import { MdHelpOutline, MdLogout, MdPersonOutline } from "react-icons/md";

export default function Page() {

  const settingButtonClass = "justify-start text-base text-basic-black font-semibold rounded-xl";

  return (
    <>
      <ContentWrapper withNav padding="xl">
        <h1 className="text-xl font-semibold text-button-point mb-6">설정</h1>

        {/* 닉네임 영역 */}
        <div className="mb-7">
          <p className="text-sm font-semibold text-gray-05 mb-1">무작위 총력전의 신</p>
          <div className="flex items-center gap-4">
            <h2 className="text-base font-semibold text-basic-black">엄청나 대단해 닉네임</h2>
            <p className="text-base font-semibold text-basic-black">#친구 코드</p>
          </div>
        </div>

        {/* 프로필 영역 */}
        <div className="mb-6">
          <div className="flex items-center gap-1 mb-2">
            <MdPersonOutline size={20} className="text-button-point" />
            <span className="text-base font-semibold text-button-point">프로필</span>
          </div>
          <div className="flex flex-col gap-2.5">
            <Button variant="unselected" size="md" fullWidth className={settingButtonClass}>
            프로필 수정
            </Button>
            <Button variant="unselected" size="md" fullWidth className={settingButtonClass}>
            칭호 수정
            </Button>
          </div>
        </div>

        {/* 지원 영역 */}
        <div className="mb-6">
          <div className="flex items-center gap-1 mb-2">
            <MdHelpOutline size={20} className="text-button-point" />
            <span className="text-base font-semibold text-button-point">지원</span>
          </div>
          <div className="flex flex-col gap-2.5">
            <Button variant="unselected" size="md" fullWidth className={settingButtonClass}>
              공지사항
            </Button>
            <Button variant="unselected" size="md" fullWidth className={settingButtonClass}>
            문의 / 버그 / FAQ
            </Button>
          </div>
        </div>

        {/* 계정 관리 영역 */}
        <div>
          <div className="flex items-center gap-1 mb-2">
            <MdLogout size={20} className="text-button-point" />
            <span className="text-base font-semibold text-button-point">계정 관리</span>
          </div>
          <div className="flex flex-col gap-2.5">
            <Button variant="unselected" size="md" fullWidth className={settingButtonClass}>
              로그아웃
            </Button>
            <Button variant="unselected" size="md" fullWidth className={settingButtonClass}>
              회원 탈퇴
            </Button>
          </div>
        </div>
      </ContentWrapper>
    </>
  );
}
