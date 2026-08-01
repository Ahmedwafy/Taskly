// app/hooks/tasks/taskCacheUtils.ts
// this replaces projectTasksSlice entirely
import { QueryClient, InfiniteData } from '@tanstack/react-query';
import { ProjectTask } from '@/types/shared';
import { TasksPageResponse } from './taskFetchers';

type BoardOrMobileCache = InfiniteData<TasksPageResponse>;
type ListCache = TasksPageResponse;
type AnyTaskCache = BoardOrMobileCache | ListCache;

// Type guard: infinite-query caches have a `pages` array; plain queries don't
function isInfiniteCache(cache: AnyTaskCache): cache is BoardOrMobileCache {
  return 'pages' in cache;
}

function patchTaskList(
  tasks: ProjectTask[],
  taskId: string,
  patch: Partial<ProjectTask>,
) {
  return tasks.map((t) => (t.id === taskId ? { ...t, ...patch } : t));
}

// Patch one task's fields inside every cached tasks query (board/list/mobile), regardless of shape
export function patchTaskInAllTaskCaches(
  queryClient: QueryClient,
  taskId: string,
  patch: Partial<ProjectTask>,
) {
  queryClient.setQueriesData<AnyTaskCache>({ queryKey: ['tasks'] }, (old) => {
    if (!old) return old;

    if (isInfiniteCache(old)) {
      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          data: patchTaskList(page.data, taskId, patch),
        })),
      };
    }

    return {
      ...old,
      data: patchTaskList(old.data, taskId, patch),
    };
  });
}

// Move a task from one board column's cache to another (drag-and-drop, or a status edit in the modal)
export function moveTaskBetweenBoardColumns(
  queryClient: QueryClient,
  projectId: string,
  taskId: string,
  fromStatus: string,
  toStatus: string,
  taskData: ProjectTask,
) {
  queryClient.setQueriesData<BoardOrMobileCache>(
    { queryKey: ['tasks', 'board', projectId, fromStatus] },
    (old) => {
      if (!old) return old;
      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          data: page.data.filter((t) => t.id !== taskId),
        })),
      };
    },
  );

  queryClient.setQueriesData<BoardOrMobileCache>(
    { queryKey: ['tasks', 'board', projectId, toStatus] },
    (old) => {
      if (!old?.pages?.length) return old;
      const pages = [...old.pages];
      pages[0] = {
        ...pages[0],
        data: [
          { ...taskData, status: toStatus as ProjectTask['status'] },
          ...pages[0].data,
        ],
      };
      return { ...old, pages };
    },
  );

  // Keep list/mobile views in sync too
  patchTaskInAllTaskCaches(queryClient, taskId, {
    status: toStatus as ProjectTask['status'],
  });
}
