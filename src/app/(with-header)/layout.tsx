import Header from '@/components/layout/Header';

export default function Layout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header title="테스트 페이지" />
      <main className="flex-1 p-4">{children}</main>
    </>
  );
}
