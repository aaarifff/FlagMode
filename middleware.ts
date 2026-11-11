import { NextResponse, type NextRequest } from 'next/server';
import { verifyToken, COOKIE_NAME } from './lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static files, flags, next internal assets, and login API
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/flags') ||
    pathname.startsWith('/api/login') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.md')
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  let isAuthenticated = false;

  if (token) {
    const payload = await verifyToken(token);
    isAuthenticated = !!payload;
  }

  // If going to login page and already authenticated, redirect to /battle
  if (pathname === '/login') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/battle', request.url));
    }
    return NextResponse.next();
  }

  // If root, redirect to /battle (which will redirect to /login if unauth)
  if (pathname === '/') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/battle', request.url));
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Any other page or API requires authentication
  if (!isAuthenticated) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
