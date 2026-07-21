import { z } from 'zod';

// ==============================================================
// ● ● ● Invite Member Schema ● ● ●
// ==============================================================

export const InviteMemberSchema = z.object({
  p_email: z
    .string()
    .trim()
    .min(1, 'Email is required.')
    .email('Enter a valid email address.'),
  p_project_id: z.string().trim().min(1, 'Project ID is required.'),
  p_app_url: z.string().trim().default(''),
  p_base_url: z.string().trim().optional().default(''),
});

// Pick only what the form component actually renders inputs for
export const InviteFormSchema = InviteMemberSchema.pick({ p_email: true });

// TypeScript type derived directly from the picked schema
export type InviteFormData = z.input<typeof InviteFormSchema>;
