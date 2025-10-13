import Header from '@/components/layout/Header';
import PartyDetailClient from '@/app/(with-nav)/parties/components/PartyDetailClient';
import ContentWrapper from '@/components/layout/ContentWrapper';

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
