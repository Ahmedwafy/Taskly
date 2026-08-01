// app/hooks/epics/useEpicTasks.ts
import { useQuery } from '@tanstack/react-query';
import { ProjectTask } from '@/types/shared';

async function fetchEpicTasks(
  projectId: string,
  epicId: string,
): Promise<ProjectTask[]> {
  const response = await fetch(
    `/api/projects/${projectId}/epics/${epicId}/tasks`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || 'Failed to fetch epic tasks');
  }

  return data as ProjectTask[];
}

interface UseEpicTasksParams {
  projectId: string;
  epicId: string | null;
  enabled: boolean;
}

export function useEpicTasks({
  projectId,
  epicId,
  enabled,
}: UseEpicTasksParams) {
  return useQuery({
    queryKey: ['epicTasks', projectId, epicId],
    queryFn: () => fetchEpicTasks(projectId, epicId as string),
    enabled: enabled && !!epicId,
  });
}
