'use client';

import ContentWrapper from '@/components/layout/ContentWrapper';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import { useState } from 'react';

export default function Page() {
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState<'남성' | '여성' | null>(null);
  const [birth, setBirth] = useState({ year: '', month: '', day: '' });

  return (
    <>
      <Header />
      <ContentWrapper>
        <div className="flex flex-col items-center w-full max-w-100 mx-auto py-10 gap-6">
          {/* 상단 안내 문구 */}
          <div className="text-center">
            <h1 className="text-2xl text-button-point">
              안녕하세요! <br />
              당신의 <span className="font-bold">프로필</span>을 알려주시겠어요?
            </h1>
          </div>

          {/* 닉네임 입력 */}
          <input
            type="text"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            placeholder="닉네임을 입력해 주세요"
            className="w-full border-b border-button-selected px-1 py-2 focus:outline-none focus:placeholder-transparent"
          />

          {/* 성별 선택 */}
          <div className="flex flex-col gap-3 w-full ">
            <Button
              variant="unselected"
              size="lg"
              fullWidth
              onClick={() => setGender('남성')}
            >
              남성
            </Button>
            <Button
              variant="unselected"
              size="lg"
              fullWidth
              onClick={() => setGender('여성')}
            >
              여성
            </Button>
          </div>

          {/* 생년월일 입력 */}
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
              placeholder="00일"
              className="w-1/3 border-b border-button-selected text-center focus:outline-none focus:placeholder-transparent"
            />
          </div>

          {/* 완료 버튼 */}
          <Button
            variant="disabled"
            size="lg"
            fullWidth
            onClick={() => console.log('완료 버튼 클릭')}
          >
            완료
          </Button>
        </div>
      </ContentWrapper>
    </>
  );
}
