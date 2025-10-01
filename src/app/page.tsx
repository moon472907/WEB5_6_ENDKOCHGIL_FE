import Nav from '@/components/nav/Nav';
import MissionCard from './components/main/MissionCard';
import Coin from '@/components/ui/Coin';
import { formatToday } from '@/utils/date';
import ExperienceBar from '@/components/ui/ExperienceBar';
import Image from 'next/image';
import Link from 'next/link';
import NewMissionButton from './components/main/NewMissionButton';

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh pb-20">
      
      <section className="flex flex-col bg-basic-white py-4 px-5 gap-2 h-[180px]">
        <div className="flex items-center justify-between gap-5 ">
          <div className="flex bg-bg-main py-1.5 px-4 gap-2 rounded-xl w-full shadow-md group">
            <Image
              src="/images/acorn.svg"
              alt="도토리"
              width={30}
              height={30}
            />
            <div className="flex gap-2 items-center justify-between w-full">
              <span className="font-medium text-sm">Lv.5</span>
              <ExperienceBar current={200} max={500} />
            </div>
          </div>
          <button className="relative">
            <Image
              src="/images/bell.svg"
              alt="종"
              width={30}
              height={30}
              className="cursor-pointer"
            />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
        <div>
          <Coin coin={100} />
        </div>
      </section>

      <section className="flex bg-nuts-floor px-5 items-center justify-end relative h-[120px]">
        <Image
          src="/images/nuts-default.png"
          alt="너츠"
          width={110}
          height={165}
          className="absolute -top-1/2 left-1/2 -translate-x-1/2 z-10"
        />
        <Link href="/shop" className="cursor-pointer">
          <Image src="/images/shop.png" alt="꾸미기" width={42} height={52} />
        </Link>
      </section>

      <section className="flex flex-col gap-2 px-7 py-4 relative flex-1">
        <div className="flex flex-col gap-9 px-2">
          <h2 className="text-lg font-semibold text-button-point">
            {formatToday()}
          </h2>
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-button-point">
              오늘의 미션
            </span>
            <span className="text-lg font-semibold text-text-sub">1/2</span>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <MissionCard />
          <MissionCard />
        </div>
        <NewMissionButton />
      </section>

      <Nav />
    </div>
  );
}
