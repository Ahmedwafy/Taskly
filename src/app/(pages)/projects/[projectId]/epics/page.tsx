// src > app > (pages) > projects > [projectId] > epics > page.tsx
import { redirect } from 'next/navigation';
import { getAuthCookies } from '@/lib/auth';
import { fetchProjectById } from '@/app/queries/projects';
import { fetchProjectEpics } from '@/app/queries/epics';
import ProjectEpics from '@/app/components/pages/ProjectEpics';

interface ProjectEpicsPageProps {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ page?: string; limit?: string; search?: string }>;
}

export default async function ProjectEpicsPage({
  params,
  searchParams,
}: ProjectEpicsPageProps) {
  const { projectId } = await params;
  const { page, limit, search } = await searchParams;

  const currentPage = Number(page) || 1;
  const currentLimit = Number(limit || 10);
  const offset = (currentPage - 1) * currentLimit;
  const searchTerm = search || '';

  const { accessToken } = await getAuthCookies();

  if (!accessToken) {
    redirect('/login');
  }

  // 1. Fetch project details and epics in parallel
  const [projectResult, epicsResult] = await Promise.allSettled([
    fetchProjectById({
      projectId,
      accessToken,
    }),
    fetchProjectEpics({
      projectId,
      limit: currentLimit,
      offset,
      accessToken,
      searchTerm,
    }),
  ]);

  // 2. Extract values safely
  const projectData =
    projectResult.status === 'fulfilled' ? projectResult.value : null;

  const epicsData =
    epicsResult.status === 'fulfilled' ? epicsResult.value : null;

  const projectEpics = epicsData?.projectEpics || [];
  const totalCount = epicsData?.totalCount || 0;

  // 3. Mark hasError if either request fails
  const hasError =
    projectResult.status === 'rejected' || epicsResult.status === 'rejected';

  if (hasError) {
    if (projectResult.status === 'rejected') {
      console.error('Failed to fetch project:', projectResult.reason);
    }
    if (epicsResult.status === 'rejected') {
      console.error('Failed to fetch epics:', epicsResult.reason);
    }
  }

  return (
    <div className="mt-10 sm:mt-0 p-5 sm:p-10">
      <ProjectEpics
        projectData={projectData}
        projectEpics={projectEpics}
        totalCount={totalCount}
        currentPage={currentPage}
        limit={currentLimit}
        searchTerm={searchTerm}
        hasError={hasError}
      />
    </div>
  );
}
