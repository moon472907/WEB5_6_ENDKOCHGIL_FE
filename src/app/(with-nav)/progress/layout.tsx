import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '진행도 - NuTree',
  description: '나의 파티 진행 상황과 달성률을 한눈에 확인해보세요.'
};

export default function ProgressLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}