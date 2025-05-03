// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const cookiesAccepted = request.cookies.get('accepted_cookies');

  if (!cookiesAccepted) {
    const response = NextResponse.next();
    response.headers.set('x-show-dialog', 'true');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/', // działa tylko na stronie głównej
};
