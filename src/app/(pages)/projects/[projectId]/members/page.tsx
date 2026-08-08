// src > app > (pages) > projects > [projectId] > members > page.tsx
import { redirect } from 'next/navigation';

import { fetchProjectById } from '@/app/queries/projects';
import { getAuthCookies } from '@/lib/auth';
import ProjectMembersPage from '@/app/components/pages/ProjectMembersPage';

interface ProjectMembersPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectMembers({
  params,
}: ProjectMembersPageProps) {
  const { projectId } = await params;
  const { accessToken } = await getAuthCookies();

  if (!accessToken) {
    redirect('/login');
  }

  const project = await fetchProjectById({
    projectId,
    accessToken,
  });

  if (!project) {
    throw new Error('Project not found');
  }

  return (
    <div className="mt-10 sm:mt-0 p-5 sm:p-10 h-full bg-background max-w-400 mx-auto">
      <ProjectMembersPage projectName={project.name} />
    </div>
  );
}
