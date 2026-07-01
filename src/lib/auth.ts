// src → lib → auth.ts
'use server';

import { cookies } from 'next/headers';
import { COOKIE_KEYS, getCookieOptions } from '@/lib/auth-cookie-config';

// Get ( Access-Token & Refresh-Token & rememberMe )
export async function getAuthCookies() {
  const cookieStore = await cookies();

  return {
    accessToken: cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value,
    refreshToken: cookieStore.get(COOKIE_KEYS.REFRESH_TOKEN)?.value,
    rememberMe: cookieStore.get(COOKIE_KEYS.REMEMBER_ME)?.value,
  };
}

// Clear Access-Token & Refresh-Token After [ Logout ]
export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete({ name: COOKIE_KEYS.ACCESS_TOKEN, path: '/' });
  cookieStore.delete({ name: COOKIE_KEYS.REFRESH_TOKEN, path: '/' });
}

// (Used only in Server Actions / Sign In)
export const setAuthCookies = async (
  accessToken: string,
  refreshToken: string,
  rememberMe = false,
) => {
  const cookieStore = await cookies();

  cookieStore.set(
    COOKIE_KEYS.ACCESS_TOKEN,
    accessToken,
    getCookieOptions(COOKIE_KEYS.ACCESS_TOKEN, rememberMe),
  );
  cookieStore.set(
    COOKIE_KEYS.REFRESH_TOKEN,
    refreshToken,
    getCookieOptions(COOKIE_KEYS.REFRESH_TOKEN, rememberMe),
  );
  cookieStore.set(
    COOKIE_KEYS.REMEMBER_ME,
    rememberMe ? '1' : '0',
    getCookieOptions(COOKIE_KEYS.REMEMBER_ME, rememberMe),
  );
};
