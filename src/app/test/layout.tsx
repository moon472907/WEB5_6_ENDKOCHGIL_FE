import Header from '@/components/layout/Header';
import Nav from '@/components/nav/Nav';

export default function TestLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header title="테스트 페이지" />
      <main className="flex-1 p-4 pb-[calc(65px+16px)]">{children}</main>
      <Nav />
    </>
  );
}
