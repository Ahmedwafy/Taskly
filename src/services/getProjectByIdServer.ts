// src/services/getProjectByIdServer.ts

import { getAuthCookies } from '@/lib/auth';
import { baseURL, supabaseKey } from '@/lib/supabase';
import { endPoints } from '@/lib/endpoints';

export const getProjectByIdServer = async (projectId: string) => {
  const { accessToken } = await getAuthCookies();

  if (!accessToken) {
    throw {
      status: 401,
      message: 'Unauthorized',
    };
  }

  const response = await fetch(
    `${baseURL}${endPoints.userData.getAllProjects}?id=eq.${projectId}`,
    {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw {
      status: response.status,
      message: 'Failed to fetch project',
    };
  }

  return data[0] ?? null;
};
