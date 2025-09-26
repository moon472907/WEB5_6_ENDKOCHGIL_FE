'use client';

import ContentWrapper from '@/components/layout/ContentWrapper';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Page() {
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState<'남성' | '여성' | null>(null);
  const [birth, setBirth] = useState({ year: '', month: '', day: '' });
  const router = useRouter();

  const currentYear = new Date().getFullYear();

  const isValidYear = (y: string) => {
    const num = Number(y);
    return num >= 1900 && num <= currentYear;
  };
  const isValidMonth = (m: string) => {
    const num = Number(m);
    return num >= 1 && num <= 12;
  };
  const isValidDay = (d: string) => {
    const num = Number(d);
    return num >= 1 && num <= 31;
  };

  const isFormValid =
    nickname.trim().length > 0 &&
    gender !== null &&
    isValidYear(birth.year) &&
    isValidMonth(birth.month) &&
    isValidDay(birth.day);

  const genderMap: Record<'남성' | '여성', 'MALE' | 'FEMALE'> = {
    남성: 'MALE',
    여성: 'FEMALE'
  };

  const handleSubmit = async () => {
    if (!isFormValid || !gender) return;

    const birthDate = `${birth.year}-${birth.month.padStart(
      2,
      '0'
    )}-${birth.day.padStart(2, '0')}`;

    try {
      const res = await fetch(
        'http://localhost:8080/api/v1/members/modify/profile',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include', // 쿠키 기반 인증 사용 시
          body: JSON.stringify({
            name: nickname,
            birth: birthDate,
            gender: genderMap[gender]
          })
        }
      );

      if (!res.ok) {
        throw new Error('프로필 입력 실패');
      }

      router.push('/home');
    } catch (error) {
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

          <input
            type="text"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            placeholder="닉네임을 입력해 주세요"
            className="w-full border-b border-button-selected px-1 py-2 focus:outline-none focus:placeholder-transparent"
          />

          <div className="flex flex-col gap-3 w-full ">
            <Button
              variant={gender === '남성' ? 'basic' : 'unselected'}
              size="lg"
              fullWidth
              onClick={() => setGender('남성')}
            >
              남성
            </Button>
            <Button
              variant={gender === '여성' ? 'basic' : 'unselected'}
              size="lg"
              fullWidth
              onClick={() => setGender('여성')}
            >
              여성
            </Button>
          </div>

          <div className="flex justify-between gap-2 w-full">
            <input
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={birth.year}
              onChange={e =>
                setBirth({
                  ...birth,
                  year: e.target.value.replace(/[^0-9]/g, '')
                })
              }
              placeholder="0000년"
              className="w-1/3  border-b border-button-selected text-center focus:outline-none focus:placeholder-transparent"
            />
            <input
              type="text"
              inputMode="numeric"
              maxLength={2}
              value={birth.month}
              onChange={e =>
                setBirth({
                  ...birth,
                  month: e.target.value.replace(/[^0-9]/g, '')
                })
              }
              onBlur={e => {
                if (e.target.value && e.target.value.length === 1) {
                  setBirth({ ...birth, month: `0${e.target.value}` });
                }
              }}
              placeholder="00월"
              className="w-1/3 border-b border-button-selected text-center focus:outline-none focus:placeholder-transparent"
            />
            <input
              type="text"
              inputMode="numeric"
              maxLength={2}
              value={birth.day}
              onChange={e =>
                setBirth({
                  ...birth,
                  day: e.target.value.replace(/[^0-9]/g, '')
                })
              }
              onBlur={e => {
                if (e.target.value && e.target.value.length === 1) {
                  setBirth({ ...birth, day: `0${e.target.value}` });
                }
              }}
              placeholder="00일"
              className="w-1/3 border-b border-button-selected text-center focus:outline-none focus:placeholder-transparent"
            />
          </div>

          <Button
            variant={isFormValid ? 'basic' : 'disabled'}
            size="lg"
            fullWidth
            disabled={!isFormValid}
            // 프로필 입력 api
            onClick={handleSubmit}
          >
            완료
          </Button>
        </div>
      </ContentWrapper>
    </>
  );
}
