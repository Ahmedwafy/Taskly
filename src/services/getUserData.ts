import { supabaseKey, baseURL } from '@/lib/supabase';
import { endPoints } from '@/lib/endpoints';

export const getUserData = async (accessToken: string) => {
  const response = await fetch(`${baseURL}${endPoints.userData.userInfo}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      apikey: supabaseKey,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    console.log('Supabase user fetch error:', data);
    throw new Error(
      data?.msg ||
        data?.error_description ||
        data?.error_code ||
        'Failed to fetch user data',
    );
  }

  return data;
};
