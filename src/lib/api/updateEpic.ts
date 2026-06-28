// src → lib → api → updateEpics.ts

import { endPoints } from '../endpoints';
import { getAuthCookies } from '../auth';
import { baseURL, supabaseKey } from '@/lib/supabase';
import { UpdateEpicArgs } from '@/types/shared';

export const fetchUpdateEpic = async ({ epicId, payload }: UpdateEpicArgs) => {
  const { accessToken } = await getAuthCookies();
  const response = await fetch(
    `${baseURL}${endPoints.epic.updateEpic(epicId)}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseKey,
        Authorization: `Bearer ${accessToken}`,
        // Optional: Tells Supabase to return the modified row if you want data back
        Prefer: 'return=representation',
      },
      body: JSON.stringify(payload),
    },
  );

  // 1. Check for failure first before attempting to parse anything
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Failed to update epic: ${errorText}`);
  }

  // 2. Safely parse JSON only if content actually exists (handles 204 No Content gracefully)
  const text = await response.text();
  const data = text ? JSON.parse(text) : { success: true };

  return data;
};
