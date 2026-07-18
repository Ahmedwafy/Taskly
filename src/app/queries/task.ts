// src > app > queries > task.ts
import { baseURL, supabaseKey } from '@/lib/supabase';
import { endPoints } from '@/lib/endpoints';

// === GET: Fetch Single Task Details ===
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

// === PATCH: Update Task Status [ Drag & Drop ] ===
interface UpdateTaskStatusProps {
  taskId: string;
  status: string;
  accessToken: string;
}
export async function updateTaskStatus({
  taskId,
  status,
  accessToken,
}: UpdateTaskStatusProps) {
  const url = `${baseURL}${endPoints.task.updateTaskStatusDragAndDrop(taskId)}`;

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      apikey: supabaseKey,
      Authorization: `Bearer ${accessToken}`,
      Prefer: 'return=representation',
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.message || errorData?.error || 'Failed to update task status',
    );
  }

  const data = await response.json();
  return Array.isArray(data) ? data[0] : data;
}
