// src/services/getProjectByIdServer.ts

import { cache } from 'react';
import { getAuthCookies } from '@/lib/auth';
import { baseURL, supabaseKey } from '@/lib/supabase';
import { endPoints } from '@/lib/endpoints';

export const getProjectByIdServer = cache(async (projectId: string) => {
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

  if (!response.ok) {
    throw {
      status: response.status,
      message: 'Failed to fetch project',
    };
  }

  const data = await response.json();
  return data[0] ?? null;
});

// Why used cache ?
// To be able to →

// Component 1:
// const project = await getProjectByIdServer(projectId);

// Component 2:
// const project = await getProjectByIdServer(projectId);

// Component 3:
// const project = await getProjectByIdServer(projectId);

// and more

// Network Cost: 1 request to Supabase.
