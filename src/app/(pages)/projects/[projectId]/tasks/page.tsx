// src → app → (pages) → projects → [projectId] → tasks → page.tsx

import ProjectTasks from '@/app/components/pages/ProjectTasks';
import { getProjectByIdServer } from '@/services/getProjectByIdServer';

interface ProjectTasksPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

const page = async ({ params }: ProjectTasksPageProps) => {
  const { projectId } = await params;
  const project = await getProjectByIdServer(projectId);

  return (
    <main className="mt-10 sm:mt-0 p-5 sm:p-10 h-full bg-background">
      <ProjectTasks projectId={projectId} projectData={project} />
    </main>
  );
};

export default page;
