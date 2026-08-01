// app/hooks/tasks/useCreateTask.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { createTaskAction } from '@/app/actions/tasks';
import { CreateTaskSchema } from '@/schemas/createNewTask.schema';

type CreateTaskPayload = z.input<typeof CreateTaskSchema>;

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateTaskPayload) => {
      const result = await createTaskAction(payload);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (_data, variables) => {
      // Invalidate this project's task list/board so it refetches with the new task
      queryClient.invalidateQueries({
        queryKey: ['tasks', variables.project_id],
      });
    },
  });
}
