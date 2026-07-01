// src → lib → auth-cookie-config.ts
export const COOKIE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  REMEMBER_ME: 'remember_me',
};

export const getCookieOptions = (key: string, rememberMe = false) => {
  const isProduction = process.env.NODE_ENV === 'production';

  let maxAge = 60 * 60; // 1 hour (Access Token default)

  if (key === COOKIE_KEYS.REFRESH_TOKEN) {
    maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7; // 30 days vs 7 days
  } else if (key === COOKIE_KEYS.REMEMBER_ME) {
    maxAge = 60 * 60 * 24 * 30; // 30 days
  }

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  };
};
