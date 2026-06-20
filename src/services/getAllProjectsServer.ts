// Call Only In --- Server Components ---
import { getAuthCookies } from '@/lib/auth';
import { baseURL, supabaseKey } from '@/lib/supabase';
import { endPoints } from '@/lib/endpoints';
import { ProjectsSchema } from '@/schemas/project.schema';

export const getAllProjectsServer = async (params: {
  limit: number;
  offset: number;
}) => {
  const { accessToken } = await getAuthCookies();

  if (!accessToken) {
    throw {
      status: 401,
      message: 'Unauthorized',
    };
  }

  const res = await fetch(
    `${baseURL}${endPoints.userData.getAllProjects}?limit=${params.limit}&offset=${params.offset}`,
    {
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseKey,
        Authorization: `Bearer ${accessToken}`,
        Prefer: 'count=exact',
      },
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw {
      status: res.status,
      message: data?.message || 'Failed server fetch',
    };
  }

  const contentRange = res.headers.get('content-range');

  const totalCount = Number(contentRange?.split('/')[1] || 0);

  const parsed = ProjectsSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error('Invalid projects data shape');
  }

  return {
    projects: parsed.data,
    totalCount,
  };
};
