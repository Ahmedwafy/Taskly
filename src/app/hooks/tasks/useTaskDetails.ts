// app/hooks/tasks/useTaskDetails.ts
import { useQuery } from '@tanstack/react-query';
import { ProjectTask } from '@/types/shared';

async function fetchTaskDetails(
  projectId: string,
  taskId: string,
): Promise<ProjectTask> {
  const response = await fetch(
    `/api/projects/${projectId}/project-tasks/${taskId}`,
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || 'Failed to fetch task details');
  }

  return data as ProjectTask;
}

export function useTaskDetails(projectId: string, taskId: string) {
  return useQuery({
    queryKey: ['taskDetails', projectId, taskId],
    queryFn: () => fetchTaskDetails(projectId, taskId),
    enabled: !!projectId && !!taskId,
  });
}
