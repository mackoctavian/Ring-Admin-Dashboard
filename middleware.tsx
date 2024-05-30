// middleware.ts
'use server';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('qroo-pos-session');

  if (!session) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

// Specify the paths where the middleware should run
export const config = {
  matcher: [
    '/((?!sign-in|sign-up|api|_next/static|_next/image|favicon.ico|public|icons).*)',
  ],
};
