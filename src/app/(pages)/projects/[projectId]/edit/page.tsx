// src/app/(pages)/projects/[projectId]/edit/page.tsx
import { redirect } from 'next/navigation';
import { fetchProjectById, fetchAllProjects } from '@/app/queries/projects';
import EditProjectPage from '@/app/components/pages/EditProjectPage';
import { getAuthCookies } from '@/lib/auth';

interface EditProjectPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function EditProject({ params }: EditProjectPageProps) {
  const { projectId } = await params;
  const { accessToken } = await getAuthCookies();

  if (!accessToken) {
    redirect('/login');
  }

  const [currentProject, allProjectsData] = await Promise.allSettled([
    fetchProjectById({ projectId, accessToken }),
    fetchAllProjects({ accessToken }),
  ]);

  if (!currentProject) {
    throw new Error('Project not found.');
  }

  const ProjectsData =
    allProjectsData.status === 'fulfilled' ? allProjectsData.value : [];

  const currentProjectData =
    currentProject.status === 'fulfilled' ? currentProject.value : null;

  return (
    <div className="mt-10 sm:mt-0 p-0 sm:p-10 h-full">
      <EditProjectPage
        projects={ProjectsData}
        projectName={currentProjectData.name}
      />
    </div>
  );
}
