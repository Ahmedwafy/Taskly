// src/proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { COOKIE_KEYS, getCookieOptions } from '@/lib/auth-cookie-config';
import { baseURL, supabaseKey } from '@/lib/supabase';
import { endPoints } from '@/lib/endpoints';

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp)$).*)',
  ],
};

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/login') {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;
  const refreshToken = request.cookies.get(COOKIE_KEYS.REFRESH_TOKEN)?.value;
  const rememberMe =
    request.cookies.get(COOKIE_KEYS.REMEMBER_ME)?.value === '1';

  // If access token is expired/missing but we have a refresh token, handle it right here automatically
  if (!accessToken && refreshToken) {
    try {
      const responseFromSupabase = await fetch(
        `${baseURL}${endPoints.auth.generateNewToken}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: supabaseKey,
          },
          body: JSON.stringify({
            refresh_token: refreshToken,
          }),
        },
      );

      if (responseFromSupabase.ok) {
        const data = await responseFromSupabase.json();
        const response = NextResponse.next();

        // Save fresh tokens straight into the response stream cookies
        response.cookies.set(
          COOKIE_KEYS.ACCESS_TOKEN,
          data.access_token,
          getCookieOptions(COOKIE_KEYS.ACCESS_TOKEN, rememberMe),
        );

        response.cookies.set(
          COOKIE_KEYS.REFRESH_TOKEN,
          data.refresh_token,
          getCookieOptions(COOKIE_KEYS.REFRESH_TOKEN, rememberMe),
        );

        return response;
      }
    } catch (error) {
      console.error('Proxy auto-refresh error:', error);
    }

    // If the refresh token fails or is expired, clear cookies and boot to login
    const loginUrl = new URL('/login', request.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete(COOKIE_KEYS.ACCESS_TOKEN);
    response.cookies.delete(COOKIE_KEYS.REFRESH_TOKEN);
    return response;
  }

  return NextResponse.next();
}
