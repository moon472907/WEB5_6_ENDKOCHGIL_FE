import Nav from '@/components/nav/Nav';

export default function Layout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="flex-1 p-4 pb-[calc(65px+16px)]">{children}</main>
      <Nav />
    </>
  );
}
