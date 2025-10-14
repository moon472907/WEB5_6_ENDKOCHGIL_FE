import { Metadata } from 'next';
import MissionLoader from './components/MissionLoader';

export const metadata: Metadata = {
  title: '미션 계획 - NuTree',
  description: 'AI가 제안한 미션 계획을 확인하고 나에게 맞게 수정해보세요.'
};

export default function Page() {
  return <MissionLoader />;
}
