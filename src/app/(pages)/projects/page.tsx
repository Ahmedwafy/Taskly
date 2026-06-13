// View User's Projects

import Button from '@/app/components/atoms/Button';
import AddProjectCard from '@/app/components/molecules/AddProjectCard';
import ProjectCard from '@/app/components/molecules/ProjectCard';
import { getAllProjects } from '@/services/getAllProjects';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import * as images from '../../../../public/images/images';

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function Projects({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;

  const currentPage = parseInt(resolvedParams.page || '1', 10) || 1;
  const itemsPerPage = 5;

  let projects;

  try {
    projects = await getAllProjects();
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      error.status === 401
    ) {
      redirect('/login');
    }

    throw error;
  }

  //  Zod validation (Response safety layer)
  // const parsed = ProjectsSchema.safeParse(rawProjects);

  // if (!parsed.success) {
  //   console.error('Invalid projects shape:', parsed.error);
  //   throw new Error('Failed to validate projects data');
  // }

  // const projects = parsed.data;

  // Pagination
  const totalProjects = projects.length;
  const totalPages = Math.ceil(totalProjects / itemsPerPage) || 1;

  const activePage = Math.max(1, Math.min(currentPage, totalPages));

  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalProjects);

  const slicedProjects = projects.slice(startIndex, endIndex);

  return (
    <main className="flex flex-col justify-between p-4 bg-(--background) min-h-screen">
      <div className="flex-1">
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

        {/* Empty State */}
        {slicedProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-6">
            <Image
              src={images.Empty_State}
              alt="No projects found"
              width={280}
              height={280}
              className="opacity-80"
              priority
            />

            <div className="flex flex-col gap-2">
              <h2 className="headline-lg text-gray-700">
                You don&apos;t have any projects yet.
              </h2>
              <p className="text-gray-400 text-sm max-w-xs mx-auto">
                Start by creating your first one.
              </p>
            </div>

            <Link href="/projects/add">
              <Button name="+ Create a Project" className="w-52!" />
            </Link>
          </div>
        ) : (
          // Projects List
          <section className="flex flex-wrap gap-y-8 py-4 px-6 justify-between w-full mt-4">
            {slicedProjects.map((project) => (
              <div key={project.id} className="w-full md:w-auto">
                <ProjectCard
                  project={project}
                  className="border border-gray-100 py-4 px-8 rounded-lg shadow-sm shadow-black/5 h-80 flex flex-col justify-between w-full md:min-w-[450px] mx-auto bg-white hover:shadow-md transition-shadow duration-300"
                />
              </div>
            ))}

            <div className="w-full md:w-auto">
              <AddProjectCard className="border-2 border-dashed border-gray-200 py-4 px-8 rounded-lg shadow-sm shadow-black/5 h-80 flex flex-col justify-center w-full md:min-w-[450px] mx-auto bg-white hover:shadow-md transition-shadow duration-300" />
            </div>
          </section>
        )}
      </div>

      {/* Pagination */}
      {totalProjects > 0 && (
        <footer className="mt-12 mb-6 px-8 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-[#4F5F7B] text-sm font-medium">
            Showing{' '}
            <span className="font-semibold text-gray-800">
              {slicedProjects.length}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-gray-800">{totalProjects}</span>{' '}
            active projects
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-x-1.5">
              {/* Prev */}
              {activePage > 1 ? (
                <Link
                  href={`/projects?page=${activePage - 1}`}
                  className="p-2 border border-gray-300 rounded-md hover:bg-gray-100"
                >
                  ←
                </Link>
              ) : (
                <div className="p-2 border border-gray-200 text-gray-300 cursor-not-allowed">
                  ←
                </div>
              )}

              {/* Pages */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) =>
                p === activePage ? (
                  <span
                    key={p}
                    className="px-3 py-1 bg-(--primary) text-white rounded-md"
                  >
                    {p}
                  </span>
                ) : (
                  <Link
                    key={p}
                    href={`/projects?page=${p}`}
                    className="px-3 py-1 border rounded-md"
                  >
                    {p}
                  </Link>
                ),
              )}

              {/* Next */}
              {activePage < totalPages ? (
                <Link
                  href={`/projects?page=${activePage + 1}`}
                  className="p-2 border border-gray-300 rounded-md hover:bg-gray-100"
                >
                  →
                </Link>
              ) : (
                <div className="p-2 border border-gray-200 text-gray-300 cursor-not-allowed">
                  →
                </div>
              )}
            </div>
          )}
        </footer>
      )}
    </main>
  );
}
