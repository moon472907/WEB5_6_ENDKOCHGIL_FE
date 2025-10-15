import ContentWrapper from '@/components/layout/ContentWrapper';
import PartyList from '@/app/(with-nav)/parties/components/PartyList';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '모집 - NuTree',
  description:
    '함께 습관을 만들고 목표를 이뤄갈 파티를 찾아보세요.'
};

export default function Page() {
  return (
    <>
      <ContentWrapper withNav>
        <PartyList />
      </ContentWrapper>
    </>
  );
}
