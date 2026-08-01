// app/hooks/tasks/taskFetchers.ts
import { ProjectTask } from '@/types/shared';

export interface TasksPageResponse {
  data: ProjectTask[];
  total: number;
}

export async function fetchProjectTasksPage(
  projectId: string,
  limit: number,
  offset: number,
  status?: string,
): Promise<TasksPageResponse> {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });
  if (status) params.set('status', status);

  const response = await fetch(
    `/api/projects/${projectId}/project-tasks?${params.toString()}`,
  );
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json?.error || 'Failed to fetch tasks');
  }

  return { data: json.data ?? [], total: json.total ?? 0 };
}
