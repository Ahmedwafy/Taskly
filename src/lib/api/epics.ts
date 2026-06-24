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

// export const fetchProjectEpics = async ({
//   projectId,
//   accessToken,
// }: FetchProjectEpicsParams): Promise<ProjectEpic[]> => {
//   // Explicitly type the return promise
//   const res = await fetch(
//     `${baseURL}${endPoints.project.getProjectEpics}${projectId}`, // + &limit={LIMIT}&offset={OFFSET}
//     {
//       headers: {
//         'Content-Type': 'application/json',
//         apikey: supabaseKey,
//         Authorization: `Bearer ${accessToken}`,
//         Prefer: 'count=exact',
//       },
//     },
//   );

//   const data = await res.json();

//   if (!res.ok) {
//     // Cast to our Error interface instead of 'any'
//     const errorData = data as BackendErrorResponse;
//     throw new Error(
//       errorData.message || errorData.error || 'Failed to fetch epics',
//     );
//   }

//   // Cast the final data to guarantee it matches your shared types
//   return data as ProjectEpic[];
// };

// src/lib/api/epics.ts

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
    `${baseURL}${endPoints.project.getProjectEpics}${projectId}&limit=${limit}&offset=${offset}`,
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
