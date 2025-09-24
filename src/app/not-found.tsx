import Button from '@/components/button';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '404 | NuTree',
  description: '요청하신 페이지를 찾을 수 없습니다.',
  robots: {
    index: false,
    follow: false
  },
  openGraph: {
    title: '404 - 페이지 없음',
    description: '잘못된 경로이거나 존재하지 않는 페이지입니다.',
    images: [
      {
        url: '/images/sad-nuts.png',
        width: 600,
        height: 600
      }
    ]
  }
};

export default function NotFound() {
  return (
    <div className="flex flex-col gap-32 items-center justify-center min-h-dvh bg-white text-center">
      <div className="flex flex-col gap-11 items-center">
        <Image
          src="/images/sad-nuts.png"
          alt="404에러"
          width={180}
          height={180}
        />

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-basic-black">404 ERROR</h2>
          <p className=" font-bold text-basic-black">
            요청하신 페이지를 찾을 수 없습니다
          </p>
        </div>
      </div>

      {/* <Link
        href="/"
        className="w-full max-w-[328px] px-6 py-3 rounded-lg text-basic-white bg-button-selected hover:bg-button-active active:bg-button-active transition-colors"
      >
        홈으로 돌아가기
      </Link> */}

      {/* TODO: button 컴포넌트 수정 완료 후, 리팩토링 예정 */}
      <Link href="/" className="block w-full max-w-[328px]">
        <Button variant="basic" size="lg" fullWidth>
          홈으로 돌아가기
        </Button>
      </Link>
    </div>
  );
}
