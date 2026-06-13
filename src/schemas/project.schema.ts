// schemas/project.schema.ts

import { z } from 'zod';

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  created_at: z.string(),
});

export const ProjectsSchema = z.array(ProjectSchema);

export type Project = z.infer<typeof ProjectSchema>;
