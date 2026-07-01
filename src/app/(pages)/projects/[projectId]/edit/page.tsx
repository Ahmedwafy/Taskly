// src/app/(pages)/projects/[projectId]/edit/page.tsx
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { COOKIE_KEYS } from '@/lib/auth-cookie-config';
import { fetchProjectById, fetchAllProjects } from '@/app/queries/projects'; // ✅ Import your clean queries
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

  const [currentProject, allProjectsData] = await Promise.all([
    fetchProjectById({ projectId, accessToken }),
    fetchAllProjects({ accessToken }),
  ]);

  if (!currentProject) {
    throw new Error('Project not found.');
  }

  return (
    <div className="mt-10 sm:mt-0 p-5 sm:p-10 h-full">
      <EditProjectPage
        projects={allProjectsData}
        projectName={currentProject.name}
      />
    </div>
  );
}
