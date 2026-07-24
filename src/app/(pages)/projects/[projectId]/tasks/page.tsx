// src → app → (pages) → projects → [projectId] → tasks → page.tsx
import { redirect } from 'next/navigation';
import ProjectTasks from '@/app/components/pages/ProjectTasks';
import { fetchProjectById } from '@/app/queries/projects';
import { getAuthCookies } from '@/lib/auth';

interface ProjectTasksPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

const ProjectTasksPage = async ({ params }: ProjectTasksPageProps) => {
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
    <div className="mt-10 sm:mt-0 p-5 sm:p-10 h-full">
      <ProjectTasks projectId={projectId} projectData={project} />
    </div>
  );
};

export default ProjectTasksPage;
