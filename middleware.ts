import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const accessToken = req.cookies.get('accessToken')?.value;

  console.log('미들웨어 실행됨:', path);
  console.log('accessToken:', accessToken ?? '없음');

  // 로그인 페이지는 통과
  if (path.startsWith('/login')) {
    return NextResponse.next();
  }

  // 비로그인 사용자는 /login으로 리다이렉트
  if (!accessToken) {
    console.warn('비로그인 접근 감지 →', path);
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  // 로그인된 사용자가 /login 접근 시 홈으로 이동
  if (accessToken && path === '/login') {
    const homeUrl = new URL('/', req.url);
    return NextResponse.redirect(homeUrl);
  }

  // 나머지는 통과
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|api|images).*)',
  ],
};
