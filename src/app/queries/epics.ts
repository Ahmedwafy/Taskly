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
  searchTerm?: string;
}

export async function fetchProjectEpics({
  projectId,
  limit,
  offset,
  accessToken,
  searchTerm,
}: FetchProjectEpicsParams) {
  // 1. base endpoint URL with pagination params
  let url = `${baseURL}${endPoints.project.getProjectEpics(projectId, limit, offset)}`;

  // 2. append title filter if a search term exists
  if (searchTerm && searchTerm.trim() !== '') {
    url += `&title=ilike.%25${encodeURIComponent(searchTerm.trim())}%25`; // encodeURIComponent: prevents user input containing special characters
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Prefer: 'count=exact', // Required for exact count to read pagination
    },
    cache: 'no-store',
  });

  let data;
  try {
    data = await response.json();
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Invalid JSON response received from API',
    );
  }

  if (!response.ok) {
    throw new Error(
      data?.message || data?.error || data?.hint || 'Failed to fetch epics',
    );
  }

  // Parse total filtered count from Content-Range header ( "0-9/25" )
  const contentRange = response.headers.get('content-range');
  let totalCount = 0;

  if (contentRange && contentRange.includes('/')) {
    const parts = contentRange.split('/'); // ['0-9', '25']
    const parsedCount = parseInt(parts[1], 10); // 25
    if (!isNaN(parsedCount)) {
      totalCount = parsedCount;
    }
  }

  return {
    projectEpics: Array.isArray(data) ? data : [], // ensure always return an array
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
