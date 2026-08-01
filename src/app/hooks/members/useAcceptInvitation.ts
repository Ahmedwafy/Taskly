// app/hooks/members/useAcceptInvitation.ts
import { useMutation } from '@tanstack/react-query';
import { AcceptInviteSchema } from '@/schemas/acceptInvitation.schema';
import { z } from 'zod';
import { acceptInvitationRequest } from '@/app/actions/members';

type AcceptInvitePayload = z.infer<typeof AcceptInviteSchema>;

interface AcceptInviteError extends Error {
  status?: number;
}

export function useAcceptInvitation() {
  return useMutation({
    mutationFn: async (payload: AcceptInvitePayload) => {
      const result = await acceptInvitationRequest(payload);
      if (result.error) {
        const error = new Error(result.error) as AcceptInviteError;
        error.status = result.status;
        throw error;
      }
      return result;
    },
  });
}
