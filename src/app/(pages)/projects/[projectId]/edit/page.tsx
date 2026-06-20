// src/app/(pages)/projects/[projectId]/edit/page.tsx
// Edit Project Page

import { redirect } from 'next/navigation';
import { getAuthCookies } from '@/lib/auth';
import EditProjectPage from '@/app/components/pages/EditProjectPage';
import PageHeader from '@/app/components/molecules/PageHeader';
import * as icons from '@/../public/icons/icons';
import { getAllProjectsServer } from '@/services/getAllProjectsServer';
import { getProjectByIdServer } from '@/services/getProjectByIdServer';

interface EditProjectPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function EditProject({ params }: EditProjectPageProps) {
  const { projectId } = await params;
  const project = await getProjectByIdServer(projectId);
  console.log(`projectId`, projectId);
  const { accessToken } = await getAuthCookies();
  if (!accessToken) {
    redirect('/login');
  }
  let projects;

  try {
    const result = await getAllProjectsServer({
      // accessToken,
      limit: 1000,
      offset: 0,
    });

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

  return (
    <>
      <PageHeader
        title="Edit Projects"
        icon={icons.Plus}
        buttonName="Create New Project"
        href="/projects/add"
        projectName={project.name}
      />
      <EditProjectPage projects={projects} />
    </>
  );
}
