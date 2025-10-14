import AppWrapper from '@/components/layout/AppWrapper';
import './globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NuTree - 작은 습관이 자라 큰 목표가 되는 곳',
  description:
    '작은 미션(Nut)들이 모여 큰 목표(Tree)를 이루는 곳, 다람쥐 너츠와 함께 성장하세요 🌰',

  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.ico' }
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }]
  },

  manifest: '/site.webmanifest',

  openGraph: {
    title: 'NuTree - 작은 습관이 자라 큰 목표가 되는 곳',
    description:
      '작은 미션(Nut)들이 모여 큰 목표(Tree)를 이루는 곳, 다람쥐 너츠와 함께 성장하세요 🌰',
    url: 'https://www.nutree.noredsun.com',
    siteName: 'NuTree',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NuTree 미리보기 이미지'
      }
    ]
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko-KR">
      <body>
        <AppWrapper>{children}</AppWrapper>
        <div id="modal-root" />
      </body>
    </html>
  );
}
