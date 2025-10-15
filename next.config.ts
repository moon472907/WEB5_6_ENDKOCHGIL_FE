import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: '/ws/:path*', destination: 'http://localhost:8080/ws/:path*' },
      { source: '/api/:path*', destination: 'http://localhost:8080/api/:path*' }
    ];
  },
  images: {
    domains: [
      'localhost', // 로컬 개발용
      'nutree.noredsun.com', // 프론트 도메인
      'api.nutree.noredsun.com' // 백엔드(이미지 제공) 도메인
    ],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'api.nutree.noredsun.com',
        pathname: '/**'
      },
      { protocol: 'https', hostname: 'nutree.noredsun.com', pathname: '/**' }
    ]
  },
  minimumCacheTTL: 0
};

export default nextConfig;
