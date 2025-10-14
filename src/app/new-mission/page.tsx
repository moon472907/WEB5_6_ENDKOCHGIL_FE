import { Metadata } from 'next';
import MissionCreateLoader from './components/MissionCreateLoader';

export const metadata: Metadata = {
  title: '미션 생성 - NuTree',
  description: '새로운 목표를 설정하고 나만의 미션을 만들어보세요.'
};

export default function Page() {
  return <MissionCreateLoader />;
}
