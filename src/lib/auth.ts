// src/lib/auth.ts
import { cookies } from 'next/headers';

// Get ( Access-Token & Refresh-Token & rememberMe )
export const getAuthCookies = async () => {
  const cookieStore = await cookies();

  return {
    accessToken: cookieStore.get('access_token')?.value,
    refreshToken: cookieStore.get('refresh_token')?.value,
    rememberMe: cookieStore.get('remember_me')?.value,
  };
};

//  Stores the (access-Token & refresh-Token & rememberMe ) in secure HTTP-only cookies.
export const setAuthCookies = async (
  accessToken: string,
  refreshToken: string,
  rememberMe = false,
) => {
  const cookieStore = await cookies();

  const accessTokenMaxAge = 60 * 60; // 1 hour

  const refreshTokenMaxAge = rememberMe
    ? 60 * 60 * 24 * 30 // 30 days
    : 60 * 60 * 24 * 7; // 7 days

  cookieStore.set('access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: accessTokenMaxAge, // 1 hour
  });

  cookieStore.set('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: refreshTokenMaxAge,
  });

  cookieStore.set('remember_me', rememberMe ? '1' : '0', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
};

// Clear Access-Token & Refresh-Token After [ Logout ]
export const clearAuthCookies = async () => {
  const cookieStore = await cookies();

  cookieStore.delete('access_token');
  cookieStore.delete('refresh_token');
};
