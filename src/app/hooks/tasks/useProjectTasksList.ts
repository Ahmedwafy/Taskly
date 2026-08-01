// app/hooks/tasks/useProjectTasksList.ts
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchProjectTasksPage } from './taskFetchers';

export function useProjectTasksList(
  projectId: string,
  page: number,
  limit: number,
  enabled: boolean,
) {
  return useQuery({
    queryKey: ['tasks', 'list', projectId, page, limit],
    queryFn: () => fetchProjectTasksPage(projectId, limit, (page - 1) * limit),
    enabled,
    placeholderData: keepPreviousData,
  });
}
