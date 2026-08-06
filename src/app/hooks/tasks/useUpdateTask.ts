// app > hooks > tasks > useUpdateTask.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProjectTask } from '@/types/shared';
import {
  patchTaskInAllTaskCaches,
  moveTaskBetweenBoardColumns,
} from './taskCacheUtils';

interface UpdateTaskPayload {
  projectId: string;
  taskId: string;
  dbPayload: Record<string, unknown>;
  optimisticPatch: Partial<ProjectTask>;
  // Pass this whenever the update changes the task's status (drag-and-drop, or the status dropdown)
  boardMove?: {
    fromStatus: string;
    toStatus: string;
    taskData: ProjectTask;
  };
}

// PATCHes one task, with optimistic update + rollback.
async function patchTask(
  projectId: string,
  taskId: string,
  dbPayload: Record<string, unknown>,
) {
  const response = await fetch(
    `/api/projects/${projectId}/project-tasks/${taskId}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dbPayload),
    },
  );

  const resData = await response.json();
  if (!response.ok) throw new Error(resData?.error || 'Failed to update task');
  return resData.data as ProjectTask;
}

// when one task changes, update it everywhere it's displayed, instantly, before the server even responds.
export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, taskId, dbPayload }: UpdateTaskPayload) =>
      // If the PATCH request succeeds, the server responds with the updated task object, which React Query caches under the taskDetails query key.
      // + the onSuccess handler invalidates the taskDetails query key, which triggers a refetch of the taskDetails from the server,
      // ensuring that the client has the most up-to-date data.
      patchTask(projectId, taskId, dbPayload),

    // onMutate => runs immediately, before any network call
    onMutate: async ({ projectId, taskId, optimisticPatch, boardMove }) => {
      const queryKey = ['taskDetails', projectId, taskId];

      // stops any in-flight refetch of that same key - avoids old GET response overwrites fresh optimistic write a moment later.
      await queryClient.cancelQueries({ queryKey });

      // Before touching anything, it snapshots the current cached task — the last known-good state and holds onto it in memory (not in the cache, just in this local variable).
      const previousTask = queryClient.getQueryData<ProjectTask>(queryKey);

      /*
        optimistic update => It manually overwrites the taskDetails cache - with the new values 'optimisticPatch',
        so the UI updates instantly, before the server even responds.
        Since - TaskDetailsPopUpModal.tsx - is subscribed to this exact query key via useTaskDetails,
        React re-renders instantly with the new title. No waiting for the network.
      */
      queryClient.setQueryData<ProjectTask>(queryKey, (old) =>
        old ? { ...old, ...optimisticPatch } : old,
      );

      if (boardMove) {
        moveTaskBetweenBoardColumns(
          queryClient,
          projectId,
          taskId,
          boardMove.fromStatus,
          boardMove.toStatus,
          boardMove.taskData,
        );
      } else {
        // Since a title edit has no boardMove ( not drag & drop ) ===> reaches into the board/list/mobile caches and patches the title there too
        patchTaskInAllTaskCaches(queryClient, taskId, optimisticPatch);
      }

      // Whatever "onMutate" returns ==> becomes the context object, passed into onError() - onSettled() later
      // This is React Query's built-in mechanism for carrying rollback data forward.
      return { previousTask, queryKey };
    },

    /*
      the rollback - onError -
      context is exactly what onMutate returned → { previousTask, queryKey }
      It writes previousTask — the pre-edit snapshot [the last known-good state] — back into ['taskDetails', projectId, taskId]
      modal, still subscribed to that key, re-renders again, and task.title snaps back to what it was before edit.
    */
    onError: (_err, { projectId }, context) => {
      if (context?.previousTask) {
        queryClient.setQueryData(context.queryKey, context.previousTask); // rollback to [the last known-good state]
      }

      /*
        Since the board/list/mobile caches were patched without a snapshot in onMutate, there's nothing to "revert" 
        so instead these get invalidateQueries, which marks them stale and triggers a background refetch to pull the true server state. 
        Slightly less instant than the detail-cache rollback, but simpler and correct.
      */
      queryClient.invalidateQueries({
        queryKey: ['tasks', 'board', projectId],
      });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'list', projectId] });
      queryClient.invalidateQueries({
        queryKey: ['tasks', 'mobile', projectId],
      });
    },

    // runs after either outcome (success or error) - triggers a refetch - ensures the taskDetails cache is always up-to-date with the server
    onSettled: (_data, _error, { projectId, taskId }) => {
      queryClient.invalidateQueries({
        queryKey: ['taskDetails', projectId, taskId],
      });
    },
  });
}
