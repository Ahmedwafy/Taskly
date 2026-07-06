// src → app → queries → epics.ts
import { baseURL, supabaseKey } from '@/lib/supabase';
import { endPoints } from '@/lib/endpoints';

// ========================================
// 1 ::: GET Project's Epics ::: Keep it Query Coz of the Pagination :::
// ========================================
interface FetchProjectEpicsParams {
  projectId: string;
  limit: number;
  offset: number;
  accessToken: string;
}
export async function fetchProjectEpics({
  projectId,
  limit,
  offset,
  accessToken,
}: FetchProjectEpicsParams) {
  const res = await fetch(
    `${baseURL}${endPoints.project.getProjectEpics(projectId, limit, offset)}`,
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
    throw new Error(data?.message || data?.error || 'Failed to fetch epics');
  }

  const contentRange = res.headers.get('content-range');
  let totalCount = 0;
  if (contentRange && contentRange.includes('/')) {
    totalCount = parseInt(contentRange.split('/')[1], 10);
  }

  return {
    projectEpics: data,
    totalCount,
  };
}

// ======================================================
// 2 ::: Get Epic's Details :::
// ======================================================
interface FetchEpicDetailsParams {
  projectId: string;
  epicId: string;
  accessToken: string;
}
export async function fetchEpicDetailsList({
  projectId,
  epicId,
  accessToken,
}: FetchEpicDetailsParams) {
  const response = await fetch(
    `${baseURL}${endPoints.project.epicDetails(projectId, epicId)}`,
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
    throw new Error(
      data?.message || data?.error || 'Failed to fetch epic details',
    );
  }

  return Array.isArray(data) ? data[0] : data;
}

// ======================================================
// 3 ::: Fetch Epic's Tasks :::
// ======================================================
interface FetchEpicTasksParams {
  epicId: string;
  accessToken: string;
}
export async function fetchEpicTasksList({
  epicId,
  accessToken,
}: FetchEpicTasksParams) {
  const response = await fetch(
    `${baseURL}${endPoints.epic.getEpicTasks(epicId)}`,
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
    throw new Error(
      data?.message || data?.error || 'Failed to fetch tasks for this epic.',
    );
  }

  return data;
}
