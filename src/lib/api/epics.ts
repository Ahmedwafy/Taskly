// The Only Source Of Truth
// src/lib/api/epics.ts

//   fetchProjectEpics()

import { baseURL, supabaseKey } from '@/lib/supabase';
import { endPoints } from '../endpoints';
import { ProjectEpic } from '@/types/shared';

interface FetchProjectEpicsParams {
  projectId: string;
  accessToken: string;
}

export const fetchProjectEpics = async ({
  projectId,
  accessToken,
}: FetchProjectEpicsParams) => {
  const res = await fetch(
    `${baseURL}${endPoints.project.getProjectEpics}${projectId}`,
    {
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseKey,
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error((data as any)?.message || 'Failed to fetch epics');
  }

  return data; // Return just the array
};
