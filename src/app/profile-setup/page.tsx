'use client';

import ContentWrapper from '@/components/layout/ContentWrapper';
import Header from '@/components/layout/Header';
import BirthInput from '@/components/ui/BirthInput';
import Button from '@/components/ui/Button';
import GenderSelect from '@/components/ui/GenderSelect';
import NicknameInput from '@/components/ui/NicknameInput';
import { genderMap } from '@/constants/gender';
import { modifyProfile } from '@/lib/api/member';
import { formatBirthDate } from '@/utils/date';
import { isValidDay, isValidMonth, isValidYear } from '@/utils/validation';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Page() {
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState<'남성' | '여성' | null>(null);
  const [birth, setBirth] = useState({ year: '', month: '', day: '' });
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
      // TODO: end point .env 에 세팅하기?
      await modifyProfile({
        name: nickname,
        birth: birthDate,
        gender: genderMap[gender]
      });

      router.push('/home');
    } catch (error) {
      // TODO : alert? modal? toast?
      console.error('프로필 입력 에러 발생:', error);
    }
  };

  return (
    <>
      <Header />
      <ContentWrapper>
        <div className="flex flex-col items-center w-full max-w-100 mx-auto py-10 gap-10">
          <div className="text-center">
            <h1 className="text-2xl text-button-point">
              안녕하세요! <br />
              당신의 <span className="font-bold">프로필</span>을 알려주시겠어요?
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
