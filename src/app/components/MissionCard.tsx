import Image from 'next/image';
import CheckboxWrapper from './CheckboxWrapper';

export default function MissionCard() {
  return (
    <div className="flex flex-col gap-7 bg-white rounded-3xl shadow-md px-5 py-4">
      <div className="flex flex-col gap-3">
        <p className="font-semibold text-gray-09">한달동안 5키로 감량하기</p>
        <div className="flex gap-1">
          <Image src="/images/person.svg" alt="사람" width={20} height={20} />
          <p className="text-sm font-medium text-gray-04">1명 참가중</p>
        </div>
      </div>

      <CheckboxWrapper />
    </div>
  );
}
