import { z } from 'zod';

export const AcceptInviteSchema = z.object({
  p_token: z.string().trim().min(1, 'Invitation token is required.'),
});

export type AcceptInviteData = z.infer<typeof AcceptInviteSchema>;
