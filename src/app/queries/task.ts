// src > app > queries > task.ts
import { baseURL, supabaseKey } from '@/lib/supabase';
import { endPoints } from '@/lib/endpoints';

interface fetchSingleTaskDetaisProps {
  projectId: string;
  taskId: string;
  accessToken: string;
}
export async function fetchSingleTaskDetais({
  projectId,
  taskId,
  accessToken,
}: fetchSingleTaskDetaisProps) {
  const response = await fetch(
    `${baseURL}${endPoints.task.getSingleTaskDetails(projectId, taskId)}`,
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

  // Returns single task (array with 1 item)
  return Array.isArray(data) ? data[0] : data;
}
