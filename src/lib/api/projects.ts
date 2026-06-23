// The Only Source Of Truth
import { baseURL, supabaseKey } from '@/lib/supabase';
import { endPoints } from '@/lib/endpoints';

type FetchProjectsParams = {
  limit: number;
  offset: number;
  accessToken: string;
};

export const fetchProjects = async ({
  limit,
  offset,
  accessToken,
}: FetchProjectsParams) => {
  const res = await fetch(
    `${baseURL}${endPoints.userData.getAllProjects}?limit=${limit}&offset=${offset}`,
    {
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseKey,
        Authorization: `Bearer ${accessToken}`,
        Prefer: 'count=exact',
      },
      cache: 'no-store',
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || 'Failed to fetch projects');
  }

  const contentRange = res.headers.get('content-range');

  const totalCount = Number(contentRange?.split('/')[1] || 0);

  return {
    projects: data,
    totalCount,
  };
};
