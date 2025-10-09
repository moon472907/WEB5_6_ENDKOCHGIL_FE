import Image from 'next/image';
import Coin from '@/components/ui/Coin';
import ExperienceBar from '@/components/ui/ExperienceBar';
import NotificationList from './notification/NotificationList';

interface HeaderSectionProps {
  profile: {
    level: number;
    xp: number;
    money: number;
    xpReq: number;
  };
  accessToken?: string;
}

export default function HeaderSection({ profile, accessToken }: HeaderSectionProps) {
  return (
    <section className="flex flex-col bg-basic-white py-4 px-5 gap-2 h-[180px]">
      <div className="flex items-center justify-between gap-5">
        <div className="flex bg-bg-main py-1.5 px-4 gap-2 rounded-xl w-full shadow-md group">
          <Image src="/images/acorn.svg" alt="도토리" width={30} height={30} />
          <div className="flex gap-2 items-center justify-between w-full">
            <span className="font-medium text-sm">Lv.{profile.level}</span>
            <ExperienceBar current={profile.xp} max={profile.xpReq} />
          </div>
        </div>

        <NotificationList accessToken={accessToken} />
      </div>

      <div>
        <Coin coin={profile.money} />
      </div>
    </section>
  );
}
