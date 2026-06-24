// src → lib → api → epics.ts
import { baseURL, supabaseKey } from '@/lib/supabase';
import { endPoints } from '../endpoints';
import { ProjectEpic } from '@/types/shared';

interface FetchProjectEpicsParams {
  projectId: string;
  accessToken: string;
}

// Define the expected structure for backend error responses
interface BackendErrorResponse {
  message?: string;
  error?: string;
}

interface FetchProjectEpicsParams {
  projectId: string;
  accessToken: string;
  page?: number;
  limit?: number;
}

export interface ProjectEpicsResponse {
  epics: ProjectEpic[];
  totalCount: number;
}

// 1. Edit Return Type to be → Object Contain data + total count
export const fetchProjectEpics = async ({
  projectId,
  accessToken,
  page = 1,
  limit = 10,
}: FetchProjectEpicsParams): Promise<ProjectEpicsResponse> => {
  // 2. Calculate Offset
  const offset = (page - 1) * limit;

  const res = await fetch(
    // final string that Supabase expects
    // `${baseURL}${endPoints.project.getProjectEpics}${projectId}&limit=${limit}&offset=${offset}`,
    `${baseURL}${endPoints.project.getProjectEpics(projectId, limit, offset)}`,
    {
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseKey,
        Authorization: `Bearer ${accessToken}`,
        Prefer: 'count=exact', // VIP to get Total Count (totalCount come in headers not in body)
      },
    },
  );

  const data = await res.json();

  if (!res.ok) {
    const errorData = data as BackendErrorResponse;
    throw new Error(
      errorData.message || errorData.error || 'Failed to fetch epics',
    );
  }

  // Get Total Count from Header's Content-Range
  // Header looks like : 0-9/50
  const contentRange = res.headers.get('content-range');
  let totalCount = 0;
  if (contentRange && contentRange.includes('/')) {
    totalCount = parseInt(contentRange.split('/')[1], 10);
  }

  return {
    epics: data as ProjectEpic[],
    totalCount,
  };
};
