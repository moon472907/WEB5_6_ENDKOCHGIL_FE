import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "localhost",              // 로컬 개발용 (http://localhost:8080)
      "nutree.noredsun.com",    // 배포용 프론트 도메인
      "api.nutree.noredsun.com" // 배포용 백엔드 도메인 (이미지 제공 서버)
    ],
  },
};

export default nextConfig;
