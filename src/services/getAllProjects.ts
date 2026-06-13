import { supabaseKey, baseURL } from '@/lib/supabase';
import { endPoints } from '@/lib/endpoints';
import { cookies } from 'next/headers';
import { ProjectsSchema } from '@/schemas/project.schema';
// get All User's Projects
export const getAllProjects = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  //   if (!accessToken) {
  //     return [];
  //   }
  if (!accessToken) {
    throw new Error('Unauthorized');
  }

  const response = await fetch(
    `${baseURL}${endPoints.userData.getAllProjects}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseKey,
        Authorization: `Bearer ${accessToken}`,
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

  //   Zod Validation Using Schema
  const parsed = ProjectsSchema.safeParse(data);

  if (!parsed.success) {
    console.error('Invalid projects data:', parsed.error);

    throw new Error('Invalid projects data shape');
  }

  return parsed.data;
};
