// app/hooks/projects/useUpdateProject.ts

import { z } from 'zod';
import { updateProjectAction } from '@/app/actions/projects';
import { UpdateProjectSchema } from '@/schemas/project.schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type UpdateProjectPayload = z.input<typeof UpdateProjectSchema>;

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateProjectPayload) => {
      const result = await updateProjectAction(payload);
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
