import Image from 'next/image';

type Provider = '카카오' | '네이버' | '구글';

interface SocialLoginButtonProps {
  provider: Provider;
  logoSrc: string;
  logoWidth: number;
  logoHeight: number;
  className: string;
}

function SocialLoginButton({ provider, logoSrc, logoWidth, logoHeight, className }: SocialLoginButtonProps) {
  return (
    // TODO : Link? api 호출? onclick? 어떻게 구현되는지 모르겠음 => api 명세서 이후에 작업
    <button
      className={`w-full max-w-[328px] h-[48px] rounded-lg shadow-[0_4px_4px_rgba(0,0,0,0.25)] cursor-pointer ${className}`}
    >
      <div className='flex justify-center gap-3 items-center'>
        <Image src={logoSrc} alt={`${provider} 로고`} width={logoWidth} height={logoHeight} style={{ width: `${logoWidth}px`, height: `${logoHeight}px` }}/>
        <span className="font-semibold">{provider}로 로그인하기</span>
      </div>
    </button>
  );
}
export default SocialLoginButton;
