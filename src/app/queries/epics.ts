// src → app → queries → epics.ts
import { baseURL, supabaseKey } from '@/lib/supabase';
import { endPoints } from '@/lib/endpoints';

// ========================================
// ::: GET Project's Epics
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

// ========================================
// ::: GET Epic's Details
// ========================================
interface FetchEpicDetailsParams {
  projectId: string;
  epicId: string;
  accessToken: string;
}

interface BackendErrorResponse {
  message?: string;
  error?: string;
}

export async function fetchEpicDetails({
  projectId,
  epicId,
  accessToken,
}: FetchEpicDetailsParams) {
  const response = await fetch(
    `${baseURL}${endPoints.project.epicDetails(projectId, epicId)}`,
    {
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseKey,
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    const errorData = data as BackendErrorResponse;
    throw new Error(
      errorData.message || errorData.error || 'Failed to fetch epic details',
    );
  }

  // Handle extracting the first item if Supabase returns it as an array filter query
  return Array.isArray(data) ? data[0] : data;
}
