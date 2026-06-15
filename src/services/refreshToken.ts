// src/services/refreshToken.ts
export const refreshToken = async () => {
  const response = await fetch('/api/refresh-token', {
    method: 'POST',
  });

  return response.ok;
};

// Calling '/api/refresh-token' will :
// send refresh_token → server
// server returns new access_token
// store it in cookies
