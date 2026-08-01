// app/hooks/projects/useCreateProject.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { createProjectAction } from '@/app/actions/projects';
import { CreateProjectSchema } from '@/schemas/project.schema';

type CreateProjectPayload = z.input<typeof CreateProjectSchema>;

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateProjectPayload) => {
      const result = await createProjectAction(payload);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', 'infinite'] });
    },
  });
}
