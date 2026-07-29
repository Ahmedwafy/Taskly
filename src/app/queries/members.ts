// src → app → queries → members.ts
import { supabaseKey, baseURL } from '@/lib/supabase';
import { endPoints } from '@/lib/endpoints';

// ==============================================================
// ::: GET Members List :::
// ==============================================================
interface FetchProjectMembersParams {
  projectId: string;
  accessToken: string;
}

export async function fetchProjectMembersList({
  projectId,
  accessToken,
}: FetchProjectMembersParams) {
  const response = await fetch(
    `${baseURL}${endPoints.projectMembers(projectId)}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseKey,
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || 'Failed to fetch members data');
  }

  return data;
}
