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

export const fetchProjectEpics = async ({
  projectId,
  accessToken,
}: FetchProjectEpicsParams): Promise<ProjectEpic[]> => {
  // Explicitly type the return promise
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
    // Cast to our Error interface instead of 'any'
    const errorData = data as BackendErrorResponse;
    throw new Error(
      errorData.message || errorData.error || 'Failed to fetch epics',
    );
  }

  // Cast the final data to guarantee it matches your shared types
  return data as ProjectEpic[];
};
