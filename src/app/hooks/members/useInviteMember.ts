// app/hooks/members/useInviteMember.ts
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { inviteMemberRequest } from '@/app/actions/members';
import { InviteMemberSchema } from '@/schemas/inviteMember.schema';

type InviteMemberPayload = Omit<
  z.input<typeof InviteMemberSchema>,
  'p_base_url'
>;

export function useInviteMember() {
  return useMutation({
    mutationFn: async (payload: InviteMemberPayload) => {
      const result = await inviteMemberRequest(payload);
      if (result.error) {
        throw new Error(result.error);
      }
      return result;
    },
  });
}
