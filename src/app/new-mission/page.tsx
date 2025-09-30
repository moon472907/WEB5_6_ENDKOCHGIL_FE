'use client';

import ContentWrapper from '@/components/layout/ContentWrapper';
import Header from '@/components/layout/Header';
import Nav from '@/components/nav/Nav';
import Toggle from '@/components/ui/Toggle';
import { useState } from 'react';
import CustomSelectBox from './components/CustomSelectBox';
import Button from '@/components/ui/Button';
import FormSection from './components/FormSection';
import GoalInput from './components/GoalInput';
import { useRouter } from 'next/navigation';
import { maxPeopleOptions, maxPeriodOptions } from '@/constants/missionOptions';

function Page() {
  const [goal, setGoal] = useState('');
  const [period, setPeriod] = useState<string | null>(null);
  const [maxPeople, setMaxPeople] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log({
      goal,
      maxPeople,
      period,
      isPublic
    });

    // TODO: API 연동
    router.push('/new-mission/preview');
  };

  return (
    <>
      <Header title="미션 생성" />
      <ContentWrapper withNav padding="xl">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 gap-5 text-stone-800 font-semibold h-full"
        >
          <FormSection
            icon="/images/target.png"
            alt="목표 설정"
            label="목표 설정"
          >
            <GoalInput value={goal} onChange={setGoal} />
          </FormSection>

          <FormSection
            icon="/images/person.png"
            alt="최대 참여 인원"
            label="최대 참여 인원"
          >
            <CustomSelectBox
              options={maxPeopleOptions}
              value={maxPeople}
              onChange={setMaxPeople}
              placeholder="최대 참여 인원수를 선택해주세요"
            />
          </FormSection>

          <FormSection
            icon="/images/calender.png"
            alt="기간"
            label="기간"
            tooltip="기간은 1주일 단위로 설정할 수 있습니다"
          >
            <CustomSelectBox
              options={maxPeriodOptions}
              value={period}
              onChange={setPeriod}
              placeholder="미션 기간을 선택해주세요"
            />
          </FormSection>

          <section className="flex flex-col gap-5 mt-auto mb-10">
            <div className="flex items-center justify-between">
              <FormSection
                icon="/images/lock.png"
                alt="공개 여부"
                label="공개 여부"
                tooltip={
                  <>
                    비공개 설정 시
                    <br />
                    파티 모집에 등록되지 않습니다
                  </>
                }
                rightElement={
                  <Toggle checked={isPublic} onChange={setIsPublic} />
                }
              ></FormSection>
            </div>
            <div>
              <Button
                type="submit"
                variant="basic"
                size="lg"
                fullWidth
                disabled={!goal || !period || !maxPeople}
              >
                미션 생성
              </Button>
            </div>
          </section>

          <Nav />
        </form>
      </ContentWrapper>
    </>
  );
}
export default Page;
