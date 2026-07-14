// src > app > (pages) > projects > [projectId] > epics > page.tsx

import { redirect } from 'next/navigation';
import { getAuthCookies } from '@/lib/auth';
import { fetchProjectById } from '@/app/queries/projects';
import { fetchProjectEpics } from '@/app/queries/epics';
import ProjectEpics from '@/app/components/pages/ProjectEpics';

interface ProjectEpicsPageProps {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ page?: string; limit?: string }>;
}

export default async function ProjectEpicsPage({
  params,
  searchParams,
}: ProjectEpicsPageProps) {
  const { projectId } = await params;
  const { page, limit } = await searchParams;

  // Resolve pagination numbers
  // const currentPage = parseInt(page || '1', 10);
  // const currentLimit = parseInt(limit || '10', 10);
  const currentPage = Number(page) || 1;
  const currentLimit = Number(limit || 10);
  const offset = (currentPage - 1) * currentLimit;

  const { accessToken } = await getAuthCookies();

  if (!accessToken) {
    redirect('/login');
  }

  const { projectEpics, totalCount } = await fetchProjectEpics({
    projectId,
    limit: currentLimit,
    offset,
    accessToken,
  });

  const projectData = await fetchProjectById({
    projectId,
    accessToken,
  });

  return (
    <div className="mt-10 sm:mt-0 p-5 sm:p-10">
      <ProjectEpics
        projectData={projectData}
        projectEpics={projectEpics}
        totalCount={totalCount}
        currentPage={currentPage}
        limit={currentLimit}
      />
    </div>
  );
}
