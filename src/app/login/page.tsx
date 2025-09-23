import Image from 'next/image';
import SocialLoginButton from './components/SocialLoginButton';

export default function Page() {
  return (
    <div className="relative w-full min-h-dvh">
      <Image
        src="/images/bg.png"
        alt="로그인배경"
        fill
        priority
        className="object-cover z-0"
      />

      <div className="relative z-10 flex flex-col items-center">
        <Image
          src="/images/logo.png"
          alt="로고"
          width={400}
          height={200}
        />
        <Image
          src="/images/nuts.png"
          alt="너츠"
          width={300}
          height={120}
           className="absolute -bottom-30 left-1/2 -translate-x-1/2 rotate-30"
        />
      </div>

      <div className="absolute flex flex-col items-center bottom-10 z-10 w-full max-w-[600px] px-4 gap-3">
        <SocialLoginButton
          provider="naver"
          className="bg-[#03C75A] text-white"
        />
        <SocialLoginButton
          provider="kakao"
          className="bg-[#FEE500] text-black"
        />
        <SocialLoginButton
          provider="google"
          className="bg-white text-black"
        />
      </div>
    </div>
  );
}
