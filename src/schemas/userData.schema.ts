import { z } from 'zod';

export const UserDataSchema = z
  .object({
    user_metadata: z.object({
      name: z.string(),
      department: z.string(),
    }),
  })
  .transform((data) => ({
    name: data.user_metadata.name,
    department: data.user_metadata.department,
  }));

export type UserData = z.infer<typeof UserDataSchema>;
