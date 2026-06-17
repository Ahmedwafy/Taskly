// Fetch Projects
// Validate Response
// Return Data

import { supabaseKey, baseURL } from '@/lib/supabase';
import { endPoints } from '@/lib/endpoints';
// import { cookies } from 'next/headers';
import { ProjectsSchema } from '@/schemas/project.schema';

interface GetProjectsParams {
  accessToken: string;
  limit: number;
  offset: number;
}

// get All User's Projects
export const getAllProjects = async ({
  limit,
  offset,
  accessToken,
}: GetProjectsParams) => {
  // const cookieStore = await cookies();
  // const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) {
    throw new Error('Unauthorized');
  }

  const response = await fetch(
    // `${baseURL}${endPoints.userData.getAllProjects}`,
    `${baseURL}${endPoints.userData.getAllProjects}?limit=${limit}&offset=${offset}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseKey,
        Authorization: `Bearer ${accessToken}`,
        Prefer: 'count=exact',
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw {
      status: response.status,
      message: data?.msg,
    };
  }

  // pagination
  const contentRange = response.headers.get('content-range');
  const totalCount = Number(contentRange?.split('/')[1] || 0); // 57
  console.log(`contentRange`, contentRange);
  console.log(`totalCount`, totalCount);

  //   Zod Validation Using Schema
  const parsed = ProjectsSchema.safeParse(data);

  if (!parsed.success) {
    console.error('Invalid projects data:', parsed.error);

    throw new Error('Invalid projects data shape');
  }

  // return parsed.data;
  return {
    projects: parsed.data,
    totalCount,
  };
};
