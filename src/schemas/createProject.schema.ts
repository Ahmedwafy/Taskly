// src/schemas/createProject.schema.ts

import { z } from 'zod';

export const CreateProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Project name must be at least 3 characters')
    .max(100, 'Project name is too long'),

  description: z.string().trim().max(500, 'Description is too long').optional(),
});

export type CreateProjectData = z.infer<typeof CreateProjectSchema>;
