// app/hooks/projects/useProjectsInfinite.ts

import { useInfiniteQuery } from '@tanstack/react-query';
import { loadMoreProjectsAction } from '@/app/actions/projects';
import { ProjectProps } from '@/types/shared';

interface UseProjectsInfiniteParams {
  initialProjects: ProjectProps[];
  initialTotalCount: number;
  limit: number;
}

export function useProjectsInfinite({
  initialProjects,
  initialTotalCount,
  limit,
}: UseProjectsInfiniteParams) {
  return useInfiniteQuery({
    queryKey: ['projects', 'infinite'],
    queryFn: async ({ pageParam }) => {
      // pageParam === 0 means "the first page" — reuse server-provided data instead of refetching it
      if (pageParam === 0) {
        return { projects: initialProjects, offset: 0 };
      }

      const result = await loadMoreProjectsAction(limit, pageParam);
      if (result.error) {
        throw new Error(result.error);
      }
      return { projects: result.projects ?? [], offset: pageParam };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const loadedCount = allPages.reduce(
        (sum, page) => sum + page.projects.length,
        0,
      );
      if (loadedCount >= initialTotalCount) return undefined; // no more pages
      return loadedCount; // next offset
    },
    initialData: {
      pages: [{ projects: initialProjects, offset: 0 }],
      pageParams: [0],
    },
  });
}
