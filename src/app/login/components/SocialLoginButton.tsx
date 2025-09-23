type Provider = "kakao" | "naver" | "google";


interface SocialLoginButtonProps {
  provider : Provider;
  className: string;
}

function OAuthButton({provider, className}: SocialLoginButtonProps) {
  return (
    // TODO : Link? api 호출? onclick? 어떻게 구현되는지 모르겠음 => api 명세서 이후에 작업
    <button className={`w-full max-w-[328px] h-[48px] rounded-lg shadow-[0_4px_4px_rgba(0,0,0,0.25)] cursor-pointer ${className}`}>{provider}로 로그인하기</button>
  )
}
export default OAuthButton