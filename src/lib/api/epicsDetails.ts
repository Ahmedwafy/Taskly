// src → lib → api → epicsDetails.ts
import { baseURL, supabaseKey } from '@/lib/supabase';
import { endPoints } from '../endpoints';
import { getAuthCookies } from '../auth';

interface FetchEpicDetailsParams {
  projectId: string;
  epicId: string;
}

// Define the expected structure for backend error responses
interface BackendErrorResponse {
  message?: string;
  error?: string;
}

export const fetchEpicDetails = async ({
  projectId,
  epicId,
}: FetchEpicDetailsParams) => {
  const { accessToken } = await getAuthCookies();
  const response = await fetch(
    // final string that Supabase expects
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
      errorData.message || errorData.error || 'Failed to fetch epics',
    );
  }

  return data;
};
