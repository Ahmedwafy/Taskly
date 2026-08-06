// app > hooks > tasks > taskCacheUtils.ts
// helper functions that reach into other caches (board columns, list view, mobile view) so they all stay visually in sync.
// this file centralizes "how to keep every visual representation of a task in sync,"
import { QueryClient, InfiniteData } from '@tanstack/react-query';
import { ProjectTask } from '@/types/shared';
import { TasksPageResponse } from './taskFetchers';

// two different cache shapes
type BoardOrMobileCache = InfiniteData<TasksPageResponse>; // Board view & Mobile View (infinite-query caches have a `pages` array, plain queries don't)
type ListCache = TasksPageResponse; // List view

// "could be either shape" used because the helper functions below need to handle both without knowing in advance which one they're touching.
type AnyTaskCache = BoardOrMobileCache | ListCache;

// Type guard: infinite-query caches have a `pages` array; plain queries don't
// it checks: does it have a pages key? If yes, TypeScript now treats it as BoardOrMobileCache inside any if block that uses this function
// letting us safely access .pages without a type error. If no, TypeScript falls back to treating it as ListCache.
// ↓
function isInfiniteCache(cache: AnyTaskCache): cache is BoardOrMobileCache {
  return 'pages' in cache;
}

// .map() returns a new array (React Query needs a new reference to detect the change and trigger a re-render)
// and trigger a re-render), and only the matching task gets a new object; all others are returned as-is (same reference, no wasted re-renders for unrelated rows).
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
  /*
  setQueriesData → React Query method that matches every cached query whose key starts with ['tasks']
  this is a prefix match, so it catches -- ['tasks', 'board', projectId, 'TODO'] -- ['tasks', 'list', projectId] -- ['tasks', 'mobile', projectId], 
  all of them in one call, regardless of how many board columns or views happen to be cached at that moment.
  
  For each matched query, the callback (old) => ... receives its current cached data and must return the new data.
  */
  queryClient.setQueriesData<AnyTaskCache>({ queryKey: ['tasks'] }, (old) => {
    if (!old) return old; // If old doesn't exist yet (query never fetched), leave it alone.

    /* 
      If it's the infinite/paginated shape
      map over every page, and within each page's data array, run patchTaskList to find-and-update the matching task if it exists in that page.
      Otherwise (flat list shape), just call patchTaskList directly on .data.

      In plain terms:
      Wherever this task appears — in any board column, the list view, or the mobile view — find it and merge these field changes in.
      This is what makes a title edit in the modal instantly reflect on the task's card on the Kanban board behind it, without needing a refetch.
    */
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
// (each column has its own separate cache entry).
export function moveTaskBetweenBoardColumns(
  queryClient: QueryClient,
  projectId: string,
  taskId: string,
  fromStatus: string,
  toStatus: string,
  taskData: ProjectTask,
) {
  /* 
  Step 1: remove the task from its old column. Targets only the specific cache for fromStatus
  (ex: the "TODO" column)
  Walks every page and .filter()s out the task with the matching id — i.e. deletes it from that column's list entirely.
  */
  queryClient.setQueriesData<BoardOrMobileCache>(
    { queryKey: ['tasks', 'board', projectId, fromStatus] }, // one cache per board column
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

  /* 
    Step 2: insert the task into its new column. Targets the toStatus column's cache. If it has no pages yet (never fetched), bail out and leave it as-is — nothing to insert into. 
    Otherwise, take the first page (pages[0]) and prepend the task (taskData, with status overwritten to toStatus) to the front of that page's data array. So the moved card visually appears at the top of the destination column.
  */
  queryClient.setQueriesData<BoardOrMobileCache>(
    { queryKey: ['tasks', 'board', projectId, toStatus] },
    (old) => {
      if (!old?.pages?.length) return old; // If it has no pages yet (never fetched),
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

  /* 
    Step 3: sync the list/mobile views too. The board columns are keyed per status, so moving between them needed the manual remove/insert flow above. 
    But the list and mobile views aren't split by status — they're just flat/paginated collections containing the task somewhere in the middle — so for those, 
    a normal in-place field patch (updating status on the existing row) is enough; no need to remove-and-reinsert. That's exactly what patchTaskInAllTaskCaches 
    already does, so it's reused here instead of duplicating logic.
  */
  patchTaskInAllTaskCaches(queryClient, taskId, {
    status: toStatus as ProjectTask['status'],
  });
}
