//  src/services/getAllProjects.ts

// Call Only In --- Client Components ---
// export const getAllProjects = async (params: {
//   limit: number;
//   offset: number;
// }) => {
//   const response = await fetch(
//     `/api/get-all-projects?limit=${params.limit}&offset=${params.offset}`,
//   );

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data?.message || 'Failed to fetch projects');
//   }

//   return data;
// };

//  src/services/getAllProjects.ts
// Call Only In --- Client Components ---
import { ProjectsSchema } from '@/schemas/project.schema';

export const getAllProjects = async (params: {
  limit: number;
  offset: number;
}) => {
  const response = await fetch(
    `/api/get-all-projects?limit=${params.limit}&offset=${params.offset}`,
    {
      method: 'GET',
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || 'Failed to fetch projects');
  }

  const parsed = ProjectsSchema.safeParse(data.projects);

  if (!parsed.success) {
    throw new Error('Invalid projects data shape');
  }

  return {
    projects: parsed.data,
    totalCount: data.totalCount,
  };
};
