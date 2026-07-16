// src > app > (pages) > projects > [projectId] > epics > page.tsx

import { redirect } from 'next/navigation';
import { getAuthCookies } from '@/lib/auth';
import { fetchProjectById } from '@/app/queries/projects';
import { fetchProjectEpics } from '@/app/queries/epics';
import ProjectEpics from '@/app/components/pages/ProjectEpics';

interface ProjectEpicsPageProps {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ page?: string; limit?: string; search?: string }>; // <-- Added search param
}

export default async function ProjectEpicsPage({
  params,
  searchParams,
}: ProjectEpicsPageProps) {
  const { projectId } = await params;
  const { page, limit, search } = await searchParams; // <-- Destructured search : when user type in search input > new param added to url > Ex: ?search='input text value'

  const currentPage = Number(page) || 1;
  const currentLimit = Number(limit || 10);
  const offset = (currentPage - 1) * currentLimit;
  const searchTerm = search || '';

  const { accessToken } = await getAuthCookies();

  if (!accessToken) {
    redirect('/login');
  }

  let projectEpics = [];
  let totalCount = 0;
  let hasError = false;

  try {
    const data = await fetchProjectEpics({
      projectId,
      limit: currentLimit,
      offset,
      accessToken,
      searchTerm, // <-- Pass down to API fetcher
    });
    projectEpics = data.projectEpics;
    totalCount = data.totalCount;
  } catch (error) {
    console.error(error);
    hasError = true;
  }

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
        //
        searchTerm={searchTerm}
        hasError={hasError}
      />
    </div>
  );
}
