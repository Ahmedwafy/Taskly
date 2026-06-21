// src/lib/auth.ts
import { cookies } from 'next/headers';

export const COOKIE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  REMEMBER_ME: 'remember_me',
} as const;

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

// Stores the (access-Token & refresh-Token & rememberMe ) in secure HTTP-only cookies.
export const setAuthCookies = async (
  accessToken: string,
  refreshToken: string,
  rememberMe = false,
) => {
  const cookieStore = await cookies();

  const isProduction = process.env.NODE_ENV === 'production';
  const accessTokenMaxAge = 60 * 60; // 1 hour

  const refreshTokenMaxAge = rememberMe
    ? 60 * 60 * 24 * 30 // 30 days
    : 60 * 60 * 24 * 7; // 7 days

  cookieStore.set(COOKIE_KEYS.ACCESS_TOKEN, accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: accessTokenMaxAge,
  });

  cookieStore.set(COOKIE_KEYS.REFRESH_TOKEN, refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: refreshTokenMaxAge,
  });

  cookieStore.set(COOKIE_KEYS.REMEMBER_ME, rememberMe ? '1' : '0', {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
};
