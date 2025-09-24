import Nav from '@/components/nav/Nav';

export default function Layout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Nav />
    </>
  );
}
