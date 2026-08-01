// app/hooks/epics/useUpdateEpicField.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateEpicAction } from '@/app/actions/epics';
import { EpicDetails } from '@/types/shared';

interface UpdateEpicFieldPayload {
  epicId: string;
  projectId: string;
  payload: Partial<EpicDetails> & { assignee_id?: string | null };
}

export function useUpdateEpicField() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      epicId,
      projectId,
      payload,
    }: UpdateEpicFieldPayload) => {
      const result = await updateEpicAction({ epicId, projectId, payload });
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },

    // Runs BEFORE the request fires — apply the optimistic patch
    onMutate: async ({ epicId, projectId, payload }) => {
      const queryKey = ['epicDetails', projectId, epicId];

      // Stop any in-flight refetch from overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the current value so we can roll back on failure
      const previousEpic = queryClient.getQueryData<EpicDetails>(queryKey);

      // Apply the optimistic patch directly to the cache
      queryClient.setQueryData<EpicDetails>(queryKey, (old) =>
        old ? { ...old, ...payload } : old,
      );

      // Passed to onError/onSettled as `context`
      return { previousEpic, queryKey };
    },

    // Runs on failure — roll back using the snapshot from onMutate
    onError: (error, _variables, context) => {
      if (context?.previousEpic) {
        queryClient.setQueryData(context.queryKey, context.previousEpic);
      }
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to update epic. Please try again.',
      );
    },

    onSuccess: () => {
      toast.success('Epic Updated Successfully');
    },

    // Runs after success OR error — resync with the server regardless
    onSettled: (_data, _error, { epicId, projectId }) => {
      queryClient.invalidateQueries({
        queryKey: ['epicDetails', projectId, epicId],
      });
    },
  });
}
