// src/app/(pages)/projects/page.tsx
// View User's Projects
// Authentication
// Redirect
import Button from '@/app/components/atoms/Button';
import { getAllProjects } from '@/services/getAllProjects';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAuthCookies } from '@/lib/auth';
import ProjectsMobile from '../../components/organisms/ProjectsMobile';
import EmptyState from '@/app/components/pages/EmptyState';
import ProjectsGrid from '@/app/components/pages/ProjectsGrid';
import DesktopPagination from '@/app/components/molecules/DesktopPagination';

export default async function Projects({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { accessToken } = await getAuthCookies();

  if (!accessToken) {
    redirect('/login');
  }

  const { page } = await searchParams;
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
    const result = await getAllProjects({
      limit,
      offset,
      accessToken,
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
  console.log({
    currentPage, // 1
    limit, // 10
    offset, // 0
    totalCount, // 16
    totalPages, // 2
  });

  // in second page  /projects?page=2
  console.log({
    currentPage, // 2
    limit, // 10
    offset, // 10
    totalCount, // 16
    totalPages, // 2
  });

  return (
    <main className="flex flex-col justify-between p-4 bg-background! min-h-screen">
      <div className="flex-1 md:block hidden">
        {/* Header */}
        <section className="flex justify-between w-full">
          <header className="w-full h-fit pt-6 pl-4 flex flex-col gap-2">
            <h1 className="headline-lg">projects</h1>
            <span className="text-gray-500">
              Manage and curate your projects
            </span>
          </header>

          <Link href="/projects/add" className="hidden lg:block">
            <Button
              name="+ Create New Project"
              className="w-75! mt-10 h-15 mr-8"
            />
          </Link>
        </section>

        {projects.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Desktop View */}
            <ProjectsGrid projects={projects} />

            {/* pagination */}
            <DesktopPagination
              currentPage={currentPage}
              totalPages={totalPages}
            />
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
