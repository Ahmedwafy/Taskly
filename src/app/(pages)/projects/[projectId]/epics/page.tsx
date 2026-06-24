// src/app/(pages)/projects/[projectId]/epics/page.tsx

import ProjectEpics from '@/app/components/pages/ProjectEpics';
import { getProjectByIdServer } from '@/services/getProjectByIdServer';
import { getProjectEpicsServer } from '@/services/getProjectEpicsServer';

interface ProjectEpicsPageProps {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ page?: string; limit?: string }>; // استقبال الـ query params
}

export default async function ProjectEpicsPage({
  params,
  searchParams,
}: ProjectEpicsPageProps) {
  const { projectId } = await params;
  const { page, limit } = await searchParams;

  const currentPage = parseInt(page || '1', 10);
  const currentLimit = parseInt(limit || '10', 10);

  const project = await getProjectByIdServer(projectId);

  // Get data according to current page
  const { epics: projectEpics, totalCount } = await getProjectEpicsServer({
    projectId,
    page: currentPage,
    limit: currentLimit,
  });

  return (
    <div className="mt-10 sm:mt-0 p-5 sm:p-10 h-full">
      <ProjectEpics
        projectData={project}
        projectEpics={projectEpics}
        totalCount={totalCount}
        currentPage={currentPage}
        limit={currentLimit}
      />
    </div>
  );
}
