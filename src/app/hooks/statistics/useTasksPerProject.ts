// app/hooks/statistics/useTasksPerProject.ts
import { useQuery } from '@tanstack/react-query';
import { TasksPerProjectItem } from '@/types/statistics';

interface UseTasksPerProjectParams {
  startDate: string;
  endDate: string;
}

async function fetchTasksPerProject(
  params: UseTasksPerProjectParams,
): Promise<TasksPerProjectItem[]> {
  const response = await fetch('/api/statistics/per-project', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const data = await response.json();

  if (!response.ok) {
    // Original code swallowed this error silently (setProjectStats([])) —
    // preserved below in the component via a fallback default, not here
    throw new Error(data?.error || 'Failed to load project stats.');
  }

  return data;
}

export function useTasksPerProject(params: UseTasksPerProjectParams) {
  return useQuery({
    queryKey: ['statistics', 'perProject', params],
    queryFn: () => fetchTasksPerProject(params),
  });
}
