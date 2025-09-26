import AppWrapper from '@/components/layout/AppWrapper';
import './globals.css';

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko-KR">
      <body>
        <AppWrapper>{children}</AppWrapper>
        <div id="modal-root" />
      </body>
    </html>
  );
}
