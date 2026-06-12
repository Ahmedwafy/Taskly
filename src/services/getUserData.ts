import { supabaseKey, baseURL } from '@/lib/supabase';
import { endPoints } from '@/lib/endpoints';
import { cookies } from 'next/headers';

export const getUserData = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) {
    return null;
  }

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
