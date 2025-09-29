import Header from '@/components/layout/Header';
import PartyDetailClient from '@/app/(with-nav)/parties/components/PartyDetailClient';
import ContentWrapper from '@/components/layout/ContentWrapper';

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
