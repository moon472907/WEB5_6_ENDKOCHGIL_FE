'use client';

import ContentWrapper from '@/components/layout/ContentWrapper';
import Header from '@/components/layout/Header';
import BirthInput from '@/components/ui/BirthInput';
import Button from '@/components/ui/Button';
import GenderSelect from '@/components/ui/GenderSelect';
import NicknameInput from '@/components/ui/NicknameInput';
import { genderMap } from '@/constants/gender';
import { putProfile, updateProfile } from '@/lib/api/member';
import { formatBirthDate } from '@/utils/date';
import { isValidDay, isValidMonth, isValidYear } from '@/utils/validation';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Props {
  mode?: 'create' | 'edit';
  initialData?: {
    nickname: string;
    gender: '남성' | '여성' | null;
    birth: { year: string; month: string; day: string };
  };
}

export default function ProfileForm({ mode = 'create', initialData }: Props) {
  const [nickname, setNickname] = useState(initialData?.nickname ?? '');
  const [gender, setGender] = useState<'남성' | '여성' | null>(initialData?.gender ?? null);
  const [birth, setBirth] = useState(initialData?.birth ?? { year: '', month: '', day: '' });
  const router = useRouter();

  const isFormValid =
    nickname.trim().length > 0 &&
    gender !== null &&
    isValidYear(birth.year) &&
    isValidMonth(birth.month) &&
    isValidDay(birth.year, birth.month, birth.day);

  const handleSubmit = async () => {
    if (!isFormValid) return;

    const birthDate = formatBirthDate(birth.year, birth.month, birth.day);

    try {
      if (mode === 'edit') {
        await updateProfile({
          name: nickname,
          birth: birthDate,
          gender: genderMap[gender],
        });
        router.push('/settings');
      } else {
        await putProfile({
          name: nickname,
          birth: birthDate,
          gender: genderMap[gender],
        });
        router.push('/');
      }
    } catch (error) {
      // TODO : alert? modal? toast?
      console.error('프로필 입력 에러 발생:', error);
    }
  };

  return (
    <>
      {mode === 'create' ? (
        <Header /> 
      ) : (
        <Header title="프로필 수정" /> 
      )}
      <ContentWrapper>
        <div className="flex flex-col items-center w-full max-w-100 mx-auto py-10 gap-10">
          <div className="text-center">
            <h1 className="text-2xl text-button-point">
              {mode === 'create' ? (
                <>
                  안녕하세요! <br />
                  당신의 <span className="font-bold">프로필</span>을 알려주시겠어요?
                </>
              ) : (
                <>
                  새로운 <span className="font-bold">프로필</span>을 입력해주세요
                </>
              )}
            </h1>
          </div>

          <NicknameInput value={nickname} onChange={setNickname} />

          <GenderSelect value={gender} onChange={setGender} />

          <BirthInput value={birth} onChange={setBirth} />

          <Button
            variant={isFormValid ? 'basic' : 'disabled'}
            size="lg"
            fullWidth
            disabled={!isFormValid}
            onClick={handleSubmit}
          >
            완료
          </Button>
        </div>
      </ContentWrapper>
    </>
  );
}
