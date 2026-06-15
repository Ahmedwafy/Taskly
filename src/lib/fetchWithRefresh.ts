// this helper fuction deals with : if Access-Token Expired (401)

// 401
//  ↓
// refresh token
//  ↓
// retry request

import { refreshToken } from '@/services/refreshToken';

export const fetchWithRefresh = async (
  input: RequestInfo,
  init?: RequestInit,
) => {
  let response = await fetch(input, init);

  if (response.status === 401) {
    const refreshed = await refreshToken();

    if (refreshed) {
      response = await fetch(input, init);
    } else {
      window.location.href = '/login';
    }
  }

  return response;
};
