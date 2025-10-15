'use client'

import ContentWrapper from "@/components/layout/ContentWrapper";
import ConfirmModal from "@/components/modal/ConfirmModal";
import SettingButton from "@/app/(with-nav)/settings/components/SettingButton";
import Link from "next/link";
import { useState } from "react";
import { MdHelpOutline, MdLogout, MdPersonOutline } from "react-icons/md";
import { logout, unregister } from "@/lib/api/member";
import { useRouter } from "next/navigation";
import AlertModal from "@/components/modal/AlertModal";

interface Profile {
  title?: string;
  name: string;
  code: string;
}

interface Props {
  profile: Profile;
}

export default function SettingsClient({ profile }: Props) {
  const router = useRouter();
  const [logoutOpen, setLogoutOpen] = useState(false); // 로그아웃 모달 열림 상태
  const [unregisterOpen, setUnregisterOpen] = useState(false); // 회원탈퇴 모달 열림 상태

  const [alertOpen, setAlertOpen] = useState(false); // AlertModal 상태
  const [alertMessage, setAlertMessage] = useState(''); // Alert 메시지
  const [redirectPath, setRedirectPath] = useState<string | null>(null); // 이동 경로

  // 로그아웃 핸들러
  const handleLogout = async () => {
    const success = await logout();
    setLogoutOpen(false);
    if (success) {
      setAlertMessage('로그아웃 되었습니다');
      setRedirectPath('/login');
      setAlertOpen(true);
    } else {
      setAlertMessage('로그아웃에 실패했습니다');
      setRedirectPath(null);
      setAlertOpen(true);
    }
  };

  // 회원탈퇴 핸들러
  const handleUnregister = async () => {
    const success = await unregister();
    setUnregisterOpen(false);
    if (success) {
      setAlertMessage('회원 탈퇴가 완료되었습니다');
      setRedirectPath('/login');
      setAlertOpen(true);
    } else {
      setAlertMessage('회원 탈퇴에 실패했습니다');
      setRedirectPath(null);
      setAlertOpen(true);
    }
  };

  const handleAlertConfirm = () => {
    setAlertOpen(false);
    if (redirectPath) router.push(redirectPath);
  };

  return (
    <>
      <ContentWrapper withNav padding="xl">
        <h1 className="text-xl font-semibold text-button-point mb-6">설정</h1>

        {/* 닉네임 영역 */}
        <div className="mb-7">
          <p className="text-sm font-semibold text-gray-05 mb-1">{profile.title ?? "칭호 없음"}</p>
          <div className="flex items-center gap-4">
            <h2 className="text-base font-semibold text-basic-black">{profile.name}</h2>
            <p className="text-base font-semibold text-basic-black">#{profile.code}</p>
          </div>
        </div>

        {/* 프로필 영역 */}
        <div className="mb-6">
          <div className="flex items-center gap-1 mb-2">
            <MdPersonOutline size={20} className="text-button-point" />
            <span className="text-base font-semibold text-button-point">프로필</span>
          </div>
          <div className="flex flex-col gap-2.5">
            <Link href="/settings/profile" tabIndex={-1}>
              <SettingButton>
                프로필 수정
              </SettingButton>
            </Link>
            <Link href="/settings/title" tabIndex={-1}>
              <SettingButton>
                칭호 수정
              </SettingButton>
            </Link>
          </div>
        </div>

        {/* 지원 영역 */}
        <div className="mb-6">
          <div className="flex items-center gap-1 mb-2">
            <MdHelpOutline size={20} className="text-button-point" />
            <span className="text-base font-semibold text-button-point">지원</span>
          </div>
          <div className="flex flex-col gap-2.5">
            <Link href="/settings/notice" tabIndex={-1}>
              <SettingButton>
                공지사항
              </SettingButton>
            </Link>
            <a
              href="https://github.com/prgrms-web-devcourse-final-project/WEB5_6_ENDKOCHGIL_FE/discussions"
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={-1}
            >
              <SettingButton>
                문의 / 버그 / FAQ
              </SettingButton>
            </a>
          </div>
        </div>

        {/* 계정 관리 영역 */}
        <div>
          <div className="flex items-center gap-1 mb-2">
            <MdLogout size={20} className="text-button-point" />
            <span className="text-base font-semibold text-button-point">계정 관리</span>
          </div>
          <div className="flex flex-col gap-2.5">
            <SettingButton onClick={() => setLogoutOpen(true)}>
              로그아웃
            </SettingButton>
            <SettingButton onClick={() => setUnregisterOpen(true)}>
              회원 탈퇴
            </SettingButton>
          </div>
        </div>

        {/* 모달 영역 */}

        {/* 로그아웃 */}
        <ConfirmModal
          open={logoutOpen}
          onConfirm={handleLogout}
          onCancel={() => setLogoutOpen(false)}
          variant="sad"
          lines={['로그아웃 하시겠습니까?']}
        />

        {/* 회원탈퇴 */}
        <ConfirmModal
          open={unregisterOpen}
          onConfirm={handleUnregister}
          onCancel={() => setUnregisterOpen(false)}
          variant="sad"
          lines={['탈퇴 후에는 복구가 어려워요','그래도 진행하시겠습니까?']}
        />

        <AlertModal
          open={alertOpen}
          onConfirm={handleAlertConfirm}
          title={alertMessage}
          confirmText="확인"
        />


      </ContentWrapper>
    </>
  );
}
