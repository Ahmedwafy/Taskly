// app/hooks/tasks/useProjectTasksBoard.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchProjectTasksPage } from './taskFetchers';

const COLUMN_LIMIT = 10;

export function useProjectTasksBoard(
  projectId: string,
  status: string,
  enabled: boolean,
) {
  return useInfiniteQuery({
    queryKey: ['tasks', 'board', projectId, status],
    queryFn: ({ pageParam }) =>
      fetchProjectTasksPage(projectId, COLUMN_LIMIT, pageParam, status),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, p) => sum + p.data.length, 0);
      if (loaded >= lastPage.total || lastPage.data.length < COLUMN_LIMIT)
        return undefined;
      return loaded;
    },
    enabled,
  });
}
