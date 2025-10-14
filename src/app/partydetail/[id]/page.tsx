import Header from '@/components/layout/Header';
import PartyDetailClient from '@/app/(with-nav)/parties/components/PartyDetailClient';
import ContentWrapper from '@/components/layout/ContentWrapper';
import { fetchPartyDetailClient } from '@/lib/api/parties/parties';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;

  try {
    const party = await fetchPartyDetailClient(id);
    const name = party?.name ?? '파티 상세';

    return {
      title: `${name} - NuTree`,
      description: `${name} 파티의 계획을 확인하고 파티원들과 대화해보세요.`
    };
  } catch (err) {
    console.error('메타데이터 생성 중 오류:', err);
    return {
      title: '파티 상세 - NuTree',
      description: '파티의 계획을 확인하고 파티원들과 대화해보세요.'
    };
  }
}

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  return (
    <>
      <Header title="파티 상세" />
      <ContentWrapper>
        <PartyDetailClient partyId={id} />
      </ContentWrapper>
    </>
  );
}
