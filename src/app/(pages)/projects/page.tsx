// src/app/(pages)/projects/page.tsx
// View User's Projects
// Authentication
// Redirect
import * as icons from '@/../public/icons/icons';
import EmptyState from '@/app/components/pages/EmptyState';
import PageHeader from '@/app/components/molecules/PageHeader';
import ProjectsGrid from '@/app/components/pages/ProjectsGrid';
import ProjectsMobile from '../../components/organisms/ProjectsMobile';
import DesktopPagination from '@/app/components/molecules/DesktopPagination';
import ProjectsPageSkeleton from './ProjectsPageSkeleton';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getAuthCookies } from '@/lib/auth';
import { getAllProjectsServer } from '@/services/getAllProjectsServer';

export default async function Projects({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
  // searchParams: { page?: string };
}) {
  const { accessToken } = await getAuthCookies();

  if (!accessToken) {
    redirect('/login');
  }

  const { page } = await searchParams;
  // const page = searchParams.page;

  const currentPage = Number(page) || 1;
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  let projects;
  let totalCount = 0;
  let totalPages = 0;

  // const pagination = {
  //   limit,
  //   offset,
  // };

  try {
    const result = await getAllProjectsServer({
      limit,
      offset,
      // accessToken,
    });
    projects = result.projects;
    totalCount = result.totalCount; // 16
    totalPages = Math.ceil(totalCount / limit);
    // totalPages = Math.ceil(16 / 10) = 2
    // Page 1 -> Projects 1 - 10
    // Page 2 -> Projects 11 - 16
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      error.status === 401 // if token expired
    ) {
      redirect('/login');
    }

    throw error;
  }

  console.log(`Projects:::::`, projects);

  // in first page /projects
  // console.log({
  //   currentPage, // 1
  //   limit, // 10
  //   offset, // 0
  //   totalCount, // 16
  //   totalPages, // 2
  // });

  // in second page  /projects?page=2
  // console.log({
  //   currentPage, // 2
  //   limit, // 10
  //   offset, // 10
  //   totalCount, // 16
  //   totalPages, // 2
  // });

  return (
    <main className="flex flex-col justify-between p-4 bg-background! min-h-screen">
      <div className="flex-1 md:block hidden">
        {/* Header */}
        <PageHeader
          title="Projects"
          icon={icons.Plus}
          buttonName="Create New Project"
          href="/projects/add"
        />

        {projects.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Desktop View */}
            <Suspense fallback={<ProjectsPageSkeleton />}>
              <ProjectsGrid projects={projects} />
            </Suspense>

            {/* pagination */}

            <DesktopPagination
              currentPage={currentPage}
              totalPages={totalPages}
              baseUrl="/projects"
            />
            {/* <DesktopPagination
              currentPage={currentPage}
              totalPages={totalPages}
            /> */}
          </>
        )}
      </div>

      {/* Mobile → Infinite scroll */}
      <div className="block md:hidden">
        <ProjectsMobile
          initialProjects={projects}
          initialTotalCount={totalCount}
          limit={limit}
        />
      </div>
    </main>
  );
}
