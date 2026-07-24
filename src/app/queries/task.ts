// src > app > queries > task.ts
import { baseURL, supabaseKey } from '@/lib/supabase';
import { endPoints } from '@/lib/endpoints';

// ==============================================
// === GET: Fetch Single Task Details ===
// ==============================================
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

// src > app > queries > task.ts
// ============================================================
// === PATCH: Task Update (Status, Title, Assignee, etc.)
// ============================================================
interface UpdateTaskDetailsParams {
  taskId: string;
  payload: Record<string, unknown>;
  accessToken: string;
}

export async function updateTaskDetails({
  taskId,
  payload,
  accessToken,
}: UpdateTaskDetailsParams) {
  // const url = `${baseURL}/rest/v1/tasks?id=eq.${taskId}`;
  const url = `${baseURL}${endPoints.task.updateTaskInfo(taskId)}`;

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation', // Returns updated row
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message || data?.error || data?.hint || 'Failed to update task',
    );
  }

  return Array.isArray(data) ? data[0] : data;
}
