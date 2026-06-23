// src → services → getAllProjectsServer.ts

//  Call Only In --- Server Components ---

import { getAuthCookies } from '@/lib/auth';
import { fetchProjects } from '@/lib/api/projects';
import { ProjectsSchema } from '@/schemas/project.schema';

export const getAllProjectsServer = async (params: {
  limit: number;
  offset: number;
}) => {
  const { accessToken } = await getAuthCookies();

  if (!accessToken) {
    throw new Error('Unauthorized');
  }

  const data = await fetchProjects({
    limit: params.limit,
    offset: params.offset,
    accessToken,
  });

  const parsed = ProjectsSchema.safeParse(data.projects);

  if (!parsed.success) {
    throw new Error('Invalid projects data shape');
  }

  return {
    projects: parsed.data,
    totalCount: data.totalCount,
  };
};
