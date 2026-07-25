// src > app > queries > statistics.ts

import { endPoints } from '@/lib/endpoints';
import { baseURL, supabaseKey } from '@/lib/supabase';
import {
  GetTasksCalendarStatsParams,
  TasksCalendarStatsResponse,
  TasksPerProjectItem,
  GetTasksPerProjectParams,
} from '@/types/statistics';

// =============================================
// GET : Tasks Calendar Stats
// =============================================

export async function getTasksCalendarStats({
  accessToken,
  startDate,
  endDate,
  projectId = null,
  status = null,
}: GetTasksCalendarStatsParams & {
  accessToken?: string;
}): Promise<TasksCalendarStatsResponse> {
  const response = await fetch(`${baseURL}${endPoints.task.getCalendarStats}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      apikey: supabaseKey,
      //   ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify({
      p_start_date: startDate,
      p_end_date: endDate,
      p_project_id: projectId,
      p_status: status,
    }),
    cache: 'no-store',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ||
        data.message ||
        data.details ||
        data.hint ||
        'Failed to fetch tasks per project',
    );
  }

  return data;
}

// =============================================
// GET : Tasks per Project
// =============================================
export async function getTasksPerProject({
  accessToken,
  startDate,
  endDate,
}: GetTasksPerProjectParams & { accessToken?: string }): Promise<
  TasksPerProjectItem[]
> {
  const response = await fetch(
    `${baseURL}${endPoints.task.getTasksPerProject}`,
    {
      method: 'POST',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        // ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({
        p_start_date: startDate,
        p_end_date: endDate,
      }),
      cache: 'no-store',
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ||
        data.message ||
        data.details ||
        data.hint ||
        'Failed to fetch tasks per project',
    );
  }

  return data;
}
