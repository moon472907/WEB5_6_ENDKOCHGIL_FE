import Image from 'next/image';

type Provider = '카카오' | '네이버' | '구글';

interface SocialLoginButtonProps {
  provider: Provider;
  logoSrc: string;
  logoWidth: number;
  logoHeight: number;
  className: string;
}

function SocialLoginButton({
  provider,
  logoSrc,
  logoWidth,
  logoHeight,
  className
}: SocialLoginButtonProps) {
  const providerMap: Record<Provider, string> = {
    카카오: 'kakao',
    네이버: 'naver',
    구글: 'google'
  };

  return (
    // TODO: 리다이렉트 주소 로딩창으로 변경 -> 로딩창에서 첫로그인인지 api 검증 -> response에 따라 profile or home 으로 리다이렉트
    <a
      href={`http://localhost:8080/oauth2/authorization/${providerMap[provider]}?redirectUrl=http://localhost:3000/home`}
      className={`w-full max-w-[328px] h-[48px] flex justify-center gap-3 items-center rounded-lg shadow-[0_4px_4px_rgba(0,0,0,0.25)] cursor-pointer ${className}`}
    >
      <Image
        src={logoSrc}
        alt={`${provider} 로고`}
        width={logoWidth}
        height={logoHeight}
        style={{ width: `${logoWidth}px`, height: `${logoHeight}px` }}
      />
      <span className="font-semibold">{provider}로 로그인하기</span>
    </a>
  );
}
export default SocialLoginButton;
