// src → schemas → epic.schema.ts
import { z } from 'zod';

// ==============================================================
// ● ● ● Create Epic Schema ● ● ●
// ==============================================================
const nullableString = z
  .union([z.string(), z.undefined(), z.null()])
  .transform((val) => (val === '' || val === undefined ? null : val));

export const CreateEpicSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Epic title must be at least 3 characters')
    .max(150, 'Epic title is too long'),

  project_id: z.string().trim().min(1, 'Project ID is required'),

  description: nullableString,
  assignee_id: nullableString,
  deadline: nullableString,
});

// Infer type for the downstream server payload
export type CreateEpicData = z.infer<typeof CreateEpicSchema>;

// ==============================================================
// ● ● ● Update Epic Schema ● ● ●
// ==============================================================
export const UpdateEpicSchema = z.object({
  epicId: z.string().trim().min(1, 'Epic ID is required'),
  projectId: z.string().trim().min(1),

  // .partial() automatically allows fields to be omitted during runtime patches
  payload: CreateEpicSchema.omit({ project_id: true }).partial(),
});

export type UpdateEpicData = z.infer<typeof UpdateEpicSchema>;
