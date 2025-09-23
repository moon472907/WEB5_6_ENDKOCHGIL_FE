import AppWrapper from '@/components/layout/AppWrapper';
import './globals.css';
import Nav from '@/components/nav/Nav';

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko-KR">
      <body>
        <AppWrapper>{children}</AppWrapper>
        <Nav />
      </body>
    </html>
  );
}
