// src > app > queries > projects.ts
import { cache } from 'react';
import { baseURL, supabaseKey } from '@/lib/supabase';
import { endPoints } from '@/lib/endpoints';
import { ProjectsSchema } from '@/schemas/project.schema';

// ======================================================
// ::: Get Project By ID :::
// ======================================================
interface FetchProjectByIdParams {
  projectId: string;
  accessToken: string;
}

// Wrapping with React's cache guarantees per-request deduplication across multiple components
export const fetchProjectById = cache(
  async ({ projectId, accessToken }: FetchProjectByIdParams) => {
    const response = await fetch(
      `${baseURL}${endPoints.userData.getAllProjects}?id=eq.${projectId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseKey,
          Authorization: `Bearer ${accessToken}`,
        },
        cache: 'no-store', // Ensures the actual database check hits fresh data
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch project');
    }

    const data = await response.json();
    return data[0] ?? null;
  },
);

// ======================================================
// ::: Get ALL Projects :::
// ======================================================
interface FetchAllProjectsParams {
  accessToken: string;
  limit?: number;
  offset?: number;
}

export const fetchAllProjects = cache(
  async ({ accessToken, limit = 1000, offset = 0 }: FetchAllProjectsParams) => {
    const response = await fetch(
      `${baseURL}${endPoints.userData.getAllProjects}?limit=${limit}&offset=${offset}`,
      {
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseKey,
          Authorization: `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch projects list');
    }

    const data = await response.json();

    // Validate the data using your existing Zod schema
    const parsed = ProjectsSchema.safeParse(data);
    if (!parsed.success) {
      console.error('Zod Parsing Error:', parsed.error);
      throw new Error('Invalid projects list data structure.');
    }

    return parsed.data;
  },
);

// ==============================================================
// ::: Get Project's Tasks :::
// ==============================================================
interface FetchProjectTasksParams {
  projectId: string;
  accessToken: string;
  taskStatus?: string;
  limit?: number;
  offset?: number;
  title?: string;
}

export async function fetchProjectTasks({
  projectId,
  accessToken,
  taskStatus,
  limit,
  offset,
  title,
}: FetchProjectTasksParams) {
  const params = new URLSearchParams();
  params.append('project_id', `eq.${projectId}`);

  if (title) {
    params.append('title', `ilike.%${title}%`);
  }

  if (taskStatus) {
    params.append('status', `eq.${taskStatus}`);
  }
  if (typeof limit === 'number') {
    params.append('limit', String(limit));
  }
  if (typeof offset === 'number') {
    params.append('offset', String(offset));
  }

  const endpointUrl = `${baseURL}${endPoints.project.getProjectTasks}?${params.toString()}`;

  const response = await fetch(endpointUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      apikey: supabaseKey,
      Authorization: `Bearer ${accessToken}`,
      Prefer: 'count=exact',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message || data?.error || 'Failed to fetch project tasks',
    );
  }

  const contentRange = response.headers.get('content-range');
  let total = 0;

  if (contentRange) {
    const parts = contentRange.split('/');
    if (parts[1]) {
      total = parseInt(parts[1], 10);
    }
  }

  return { data, total };
}
