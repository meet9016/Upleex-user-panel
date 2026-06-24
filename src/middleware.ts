import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Split path and check if any segment is "null" (case-insensitive)
  const segments = pathname.toLowerCase().split('/');
  if (segments.includes('null')) {
    // Rewrite to a non-existent path to trigger the Next.js 404 page
    return NextResponse.rewrite(new URL('/not-found', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions (e.g. png, jpg, svg)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
