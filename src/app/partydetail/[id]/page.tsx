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

type Party = {
  id: number | string;
  name?: string | null;
};

type ApiResponse = {
  content?: {
    content?: Party[];
  };
};

type ParamsObject = { id: string };
type PropsSync = { params: ParamsObject | Promise<ParamsObject> };
type PageProps = PropsSync | Promise<PropsSync>;

export default async function Page(props: PageProps) {
  const awaitedProps = await props;
  const params = await awaitedProps.params;
  const { id } = params;

  // API 베이스 (없으면 로컬 기본)
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';
  let partyName = '파티 상세';

  try {
    // 목록에서 해당 id 파티를 찾아 제목으로 사용
    const res = await fetch(`${API_BASE.replace(/\/$/, '')}/api/v1/parties?page=0&size=100`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const json = (await res.json()) as ApiResponse;
      const items: Party[] = json?.content?.content ?? [];
      const found = items.find((p) => String(p.id) === String(id));
      if (found && typeof found.name === 'string') partyName = found.name;
    }
  } catch {
    // noop
  }

  return (
    <>
      <Header title={partyName} />
      <ContentWrapper>
        <PartyDetailClient partyId={id} />
      </ContentWrapper>
    </>
  );
}
