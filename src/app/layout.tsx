import AppWrapper from '@/components/layout/AppWrapper';
import './globals.css';
import Nav from '@/components/nav/Nav';
import Header from '@/components/layout/Header';

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko-KR">
      <body>
        <AppWrapper>
          <Header title="test" />
          {children}
          <Nav />
        </AppWrapper>
      </body>
    </html>
  );
}
