import ContentWrapper from '@/components/layout/ContentWrapper';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import DayPlanItem from '@/components/ui/DayPlanItem';
import LockPlanItem from '@/components/ui/LockPlanItem';
import Tooltip from '@/components/ui/Tooltip';
import Image from 'next/image';
import { FaExclamationTriangle } from 'react-icons/fa';

function Page() {
  return (
    <>
      <Header title="생성한 미션 확인" />
      <ContentWrapper padding="xl">
        <div className="flex flex-col gap-12">
          <section className="flex flex-col">
            <div className="flex gap-1 items-center">
              <p className="text-gray-09 font-bold text-lg">AI 생성 계획</p>
              <Tooltip
                message={
                  <>
                    미션은 일주일 전에 생성됩니다
                    <br />
                    다음주까지의 계획을 수정할 수 있습니다
                  </>
                }
                position="bottom"
              >
                <Image
                  src="/images/info.png"
                  alt={`생성 계획 도움말`}
                  width={20}
                  height={20}
                  className="w-[20px] h-[20px] object-contain cursor-pointer"
                />
              </Tooltip>
            </div>
            <p className="text-gray-04 font-semibold text-sm">
              미션 계획이 생성되었어요
            </p>
          </section>
          <section className="flex flex-col gap-2">
            <p className="flex items-center gap-1 text-orange-main font-semibold text-sm">
              <FaExclamationTriangle className="text-lg" />
              수정 시 AI 추천과 다르게 진행될 수 있습니다
            </p>
            <main className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <p className="text-gray-09 font-bold text-lg">
                  단계별 계획 1주차
                </p>
                <div className="flex flex-col gap-2">
                  <DayPlanItem day={1} title="단어 10개 암기" variant="next" />
                  <DayPlanItem day={2} title="단어 10개 암기" variant="next" />
                  <DayPlanItem day={3} title="단어 10개 암기" variant="next" />
                  <DayPlanItem day={4} title="단어 10개 암기" variant="next" />
                  <DayPlanItem day={5} title="단어 10개 암기" variant="next" />
                  <DayPlanItem day={6} title="단어 10개 암기" variant="next" />
                  <DayPlanItem day={7} title="단어 10개 암기" variant="next" />
                </div>
              </div>
              <hr className="text-button-selected" />
              <div className="flex flex-col gap-2">
                <p className="text-gray-09 font-bold text-lg">
                  단계별 계획 2주차
                </p>
                <div className="flex flex-col gap-2">
                  <DayPlanItem day={1} title="단어 10개 암기" variant="next" />
                  <DayPlanItem day={2} title="단어 10개 암기" variant="next" />
                  <DayPlanItem day={3} title="단어 10개 암기" variant="next" />
                  <DayPlanItem day={4} title="단어 10개 암기" variant="next" />
                  <DayPlanItem day={5} title="단어 10개 암기" variant="next" />
                  <DayPlanItem day={6} title="단어 10개 암기" variant="next" />
                  <DayPlanItem day={7} title="단어 10개 암기" variant="next" />
                </div>
              </div>
              <hr className="text-button-selected" />
              <LockPlanItem label="단계별 계획 3주차" />
              <hr className="text-button-selected" />
              <LockPlanItem label="단계별 계획 4주차" />
            </main>

            <Button
              type="submit"
              variant="basic"
              size="lg"
              fullWidth
              className="flex mt-20 mb-5"
            >
              미션 생성 완료
            </Button>
          </section>
        </div>
      </ContentWrapper>
    </>
  );
}
export default Page;
