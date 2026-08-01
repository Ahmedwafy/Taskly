// app/hooks/epics/useCreateEpic.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { createEpicAction } from '@/app/actions/epics';
import { CreateEpicSchema } from '@/schemas/epic.schema';

type CreateEpicPayload = z.input<typeof CreateEpicSchema>;

export function useCreateEpic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateEpicPayload) => {
      const result = await createEpicAction(payload);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (_data, variables) => {
      // Invalidate the epics list for this project so it refetches with the new epic
      queryClient.invalidateQueries({
        queryKey: ['epics', variables.project_id],
      });
    },
  });
}
