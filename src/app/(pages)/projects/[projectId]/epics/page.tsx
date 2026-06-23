// src/app/(pages)/projects/[projectId]/epics/page.tsx

import ProjectEpics from '@/app/components/pages/ProjectEpics';
import { getProjectByIdServer } from '@/services/getProjectByIdServer';
import { getProjectEpicsServer } from '@/services/getProjectEpicsServer';

interface ProjectEpicsPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectEpicsPage({
  params,
}: ProjectEpicsPageProps) {
  const { projectId } = await params;
  const project = await getProjectByIdServer(projectId);
  const projectEpics = await getProjectEpicsServer({ projectId }); // TODO ::: Pagination
  console.log(`projectEpics:`, projectEpics);

  return (
    <div className="mt-10 sm:mt-0 p-5 sm:p-10 h-full">
      <ProjectEpics projectData={project} projectEpics={projectEpics} />
    </div>
  );
}
//
