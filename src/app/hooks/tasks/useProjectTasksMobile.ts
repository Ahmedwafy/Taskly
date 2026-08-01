// app/hooks/tasks/useProjectTasksMobile.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchProjectTasksPage } from './taskFetchers';

const LIMIT_MOBILE = 10;

export function useProjectTasksMobile(projectId: string, enabled: boolean) {
  return useInfiniteQuery({
    queryKey: ['tasks', 'mobile', projectId],
    queryFn: ({ pageParam }) =>
      fetchProjectTasksPage(projectId, LIMIT_MOBILE, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, p) => sum + p.data.length, 0);
      if (loaded >= lastPage.total || lastPage.data.length < LIMIT_MOBILE)
        return undefined;
      return loaded;
    },
    enabled,
  });
}
