// src → schemas → createNewTask.schema.ts
import { z } from 'zod';

// ==============================================================
// ● ● ● Create New Task Schema ● ● ●
// ==============================================================

const nullableString = z
  .union([z.string(), z.undefined(), z.null()])
  .transform((val) => (val === '' || val === undefined ? null : val));

export const CreateTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(150, 'Title is too long'),

  project_id: z.string().uuid('Invalid Project ID format'),
  epic_id: nullableString,
  description: nullableString,
  assignee_id: nullableString,
  due_date: nullableString,
  status: z.string().trim().default('TO_DO'),
});

// Let Zod infer the type automatically here!
// the OUT-PUT type
// Zod looks at the final, processed results after all validation and transformations are finished.
export type CreateTaskData = z.infer<typeof CreateTaskSchema>;
//
//
//
//
// Because of that .transform(), CreateTaskData expects epic_id, description, assignee_id, and due_date to be strictly string or null.
// They cannot be an empty string "" or undefined anymore, because Zod already changed them.
