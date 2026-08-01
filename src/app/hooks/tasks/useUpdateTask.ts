// app/hooks/tasks/useUpdateTask.ts
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

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, taskId, dbPayload }: UpdateTaskPayload) =>
      patchTask(projectId, taskId, dbPayload),

    onMutate: async ({ projectId, taskId, optimisticPatch, boardMove }) => {
      const queryKey = ['taskDetails', projectId, taskId];
      await queryClient.cancelQueries({ queryKey });
      const previousTask = queryClient.getQueryData<ProjectTask>(queryKey);

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
        patchTaskInAllTaskCaches(queryClient, taskId, optimisticPatch);
      }

      return { previousTask, queryKey };
    },

    onError: (_err, { projectId }, context) => {
      if (context?.previousTask) {
        queryClient.setQueryData(context.queryKey, context.previousTask);
      }
      // Board/list/mobile caches were patched without individual snapshots —
      // resync from the server instead of hand-rolling a multi-cache rollback
      queryClient.invalidateQueries({
        queryKey: ['tasks', 'board', projectId],
      });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'list', projectId] });
      queryClient.invalidateQueries({
        queryKey: ['tasks', 'mobile', projectId],
      });
    },

    onSettled: (_data, _error, { projectId, taskId }) => {
      queryClient.invalidateQueries({
        queryKey: ['taskDetails', projectId, taskId],
      });
    },
  });
}
