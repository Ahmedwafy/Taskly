// src/app/queries/user.ts
import { supabaseKey, baseURL } from '@/lib/supabase';
import { endPoints } from '@/lib/endpoints';
import { UserDataSchema } from '@/schemas/userData.schema';

// ==============================================================
// ::: GET User's Data :::
// ==============================================================
interface FetchUserDataParams {
  accessToken: string;
}
export async function fetchUserData({ accessToken }: FetchUserDataParams) {
  if (!accessToken) return null;

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
    console.error('Supabase user fetch error:', data);
    throw new Error(
      data?.msg ||
        data?.error_description ||
        data?.error_code ||
        'Failed to fetch user data',
    );
  }

  // ✅ Zod Validation Using Schema
  const parsed = UserDataSchema.safeParse(data);

  if (!parsed.success) {
    console.error('Invalid user data structure:', parsed.error);
    throw new Error('Invalid user data shape');
  }

  return parsed.data;
}
