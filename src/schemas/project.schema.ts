// schemas → project.schema.ts
import { z } from 'zod';

// ==============================================================
// ● ● ● Database Entities & Response Shapes ( Project Schema ) ● ● ●
// ==============================================================
export const ProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  created_at: z.string(),
  created_by: z.string(),
});

export const ProjectsSchema = z.array(ProjectSchema);

export type Project = z.infer<typeof ProjectSchema>;

// ==============================================================
// ● ● ● Create Project Schema ● ● ●
// ==============================================================
export const CreateProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Project name must be at least 3 characters')
    .max(100, 'Project name is too long'),

  description: z
    .string()
    .trim()
    .max(500, 'Description is too long')
    .default(''), // ensures Zod outputs a string, eliminating manual '??' checks later
});

export type CreateProjectData = z.infer<typeof CreateProjectSchema>;

// ==============================================================
// ● ● ● Update Project ● ● ●
// ==============================================================
export const UpdateProjectSchema = z.object({
  projectId: z.string().trim().min(1, 'Project ID is required'),

  name: z
    .string()
    .trim()
    .min(3, 'Project name must be at least 3 characters')
    .max(100, 'Project name is too long'),

  description: z
    .string()
    .trim()
    .max(500, 'Description is too long')
    .default(''),
});

export type UpdateProjectData = z.infer<typeof UpdateProjectSchema>;
