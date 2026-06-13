import Button from '@/app/components/atoms/Button';
import AddProjectCard from '@/app/components/molecules/AddProjectCard';
import ProjectCard from '@/app/components/molecules/ProjectCard';
import { getAllProjects } from '@/services/getAllProjects';
import Link from 'next/link';

type Project = {
  id: string;
  name: string;
  description: string;
  created_at: string;
};

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

// View User's Projects
export default async function projects({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const currentPage = parseInt(resolvedParams.page || '1', 10) || 1;
  const itemsPerPage = 5;

  const rawProjects = await getAllProjects();
  const projects: Project[] = Array.isArray(rawProjects) ? rawProjects : [];

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
            <span className="text-gray-500">Manage and curate your projects</span>
          </header>

          <Link href="/projects/add" className='hidden lg:block'>
            <Button
              name="+ Create New Project"
              className="w-75! mt-10 h-15 mr-8"
            />
          </Link>
        </section>

        {slicedProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-gray-500 text-lg mb-4">No projects found.</p>
            <Link href="/projects/add">
              <Button name="Create a Project" />
            </Link>
          </div>
        ) : (
          <section className='flex flex-wrap gap-x-0 gap-y-8 py-4 px-6 justify-center md:justify-start w-full mt-4 gap-8!'>
            {slicedProjects.map((project) => (
              <div key={project.id}>
                <ProjectCard
                  project={project}
                  className='border border-gray-100 py-4 px-8 rounded-lg shadow-sm shadow-black/5 h-80 flex flex-col justify-center md:justify-between w-full md:min-w-[450px] mx-auto bg-white hover:shadow-md transition-shadow duration-300'
                />
              </div>
            ))}
            <div>
              <AddProjectCard
                className='border border-gray-100 py-4 px-8 rounded-lg shadow-sm shadow-black/5 h-80 flex flex-col justify-center md:justify-between w-full md:min-w-[450px] mx-auto bg-white hover:shadow-md transition-shadow duration-300'
              />
            </div>
          </section>
        )}
      </div>

      {/* Pagination Footer */}
      {totalProjects > 0 && (
        <footer className="mt-12 mb-6 px-8 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Showing X of Y text */}
          <div className="text-[#4F5F7B] text-sm font-medium">
            Showing{' '}
            <span className="font-semibold text-gray-800">{slicedProjects.length}</span>{' '}
            of{' '}
            <span className="font-semibold text-gray-800">{totalProjects}</span>{' '}
            active projects
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-x-1.5">
              {/* Previous Arrow */}
              {activePage > 1 ? (
                <Link
                  href={`/projects?page=${activePage - 1}`}
                  className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-700"
                  aria-label="Previous page"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
              ) : (
                <div
                  className="p-2 border border-gray-200 rounded-md bg-gray-50 text-gray-300 cursor-not-allowed flex items-center justify-center"
                  aria-disabled="true"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
              )}

              {/* Page Number Buttons */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                const isActive = p === activePage;
                return isActive ? (
                  <span
                    key={p}
                    className="px-3.5 py-1.5 bg-(--primary) text-white text-sm font-semibold rounded-md flex items-center justify-center select-none"
                  >
                    {p}
                  </span>
                ) : (
                  <Link
                    key={p}
                    href={`/projects?page=${p}`}
                    className="px-3.5 py-1.5 border border-gray-300 rounded-md text-gray-700 text-sm font-medium hover:bg-gray-100 transition-colors flex items-center justify-center"
                  >
                    {p}
                  </Link>
                );
              })}

              {/* Next Arrow */}
              {activePage < totalPages ? (
                <Link
                  href={`/projects?page=${activePage + 1}`}
                  className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-700"
                  aria-label="Next page"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <div
                  className="p-2 border border-gray-200 rounded-md bg-gray-50 text-gray-300 cursor-not-allowed flex items-center justify-center"
                  aria-disabled="true"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          )}
        </footer>
      )}
    </main>
  );
}
