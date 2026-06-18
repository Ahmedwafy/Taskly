// src/app/(pages)/projects/[projectId]/edit/page.tsx
// Edit Project Page
import { getAllProjects } from '@/services/getAllProjects';
import { redirect } from 'next/navigation';
import { getAuthCookies } from '@/lib/auth';
import EditProjectPage from '@/app/components/pages/EditProjectPage';

export default async function Edit_Project() {
  const { accessToken } = await getAuthCookies();
  if (!accessToken) {
    redirect('/login');
  }

  let projects;

  try {
    const result = await getAllProjects({ accessToken, limit: 10, offset: 0 });
    // console.log('RESULT', result);
    projects = result.projects;
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      error.status === 401 // if token expired
    ) {
      redirect('/login');
    }

    throw error;
  }

  return <EditProjectPage projects={projects} />;
}
