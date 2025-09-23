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
        <Image src="/images/logo.png" alt="로고" width={400} height={400} />
        <Image
          src="/images/nuts.png"
          alt="너츠"
          width={300}
          height={200}
          className="absolute -bottom-30 left-1/2 -translate-x-1/2 rotate-30"
        />
      </div>

      <div className="absolute flex flex-col items-center bottom-10 z-10 w-full max-w-[600px] px-4 gap-3">
        <SocialLoginButton
          provider="네이버"
          logoSrc="/images/naver-logo.png"
          logoWidth={20}
          logoHeight={20}
          className="bg-[#03C75A] text-white"
        />
        <SocialLoginButton
          provider="카카오"
          logoSrc="/images/kakao-logo.png"
          logoWidth={20}
          logoHeight={18}
          className="bg-[#FEE500] text-black"
        />
        <SocialLoginButton
          provider="구글"
          logoSrc="/images/google-logo.png"
          logoWidth={20}
          logoHeight={21}
          className="bg-white text-black"
        />
      </div>
    </div>
  );
}
