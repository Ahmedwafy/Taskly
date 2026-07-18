// src > app > (pages) > projects > page.tsx [no layout here]
import EmptyState from '@/app/components/pages/EmptyState';
import PageHeader from '@/app/components/molecules/PageHeader';
import ProjectsGrid from '@/app/components/pages/ProjectsGrid';
import ProjectsMobile from '../../components/organisms/ProjectsMobile';
import DesktopPagination from '@/app/components/molecules/DesktopPagination';
import ProjectsPageSkeleton from './ProjectsPageSkeleton';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { baseURL, supabaseKey } from '@/lib/supabase';
import { endPoints } from '@/lib/endpoints';
import { COOKIE_KEYS } from '@/lib/auth-cookie-config';
import { ProjectsSchema } from '@/schemas/project.schema';
import WhitePlus from '@/../public/svgIcons/WhitePlus.svg';

export default async function Projects({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;

  if (!accessToken) {
    redirect('/login');
  }

  // Resolve pagination numbers
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const limit = 10;
  const offset = (currentPage - 1) * limit;
  const CreateProjectIcon = WhitePlus;

  const res = await fetch(
    `${baseURL}${endPoints.userData.getAllProjects}?limit=${limit}&offset=${offset}`,
    {
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseKey,
        Authorization: `Bearer ${accessToken}`,
        Prefer: 'count=exact',
      },
      cache: 'no-store', // Ensures data is never stale on hard refresh
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || 'Failed to load projects');
  }

  // 4. Validate data shape using Zod on the server side
  const parsed = ProjectsSchema.safeParse(data);
  if (!parsed.success) {
    console.error('Zod Parsing Error:', parsed.error);
    throw new Error('Invalid projects data structure returned from server.');
  }

  const projects = parsed.data;
  const contentRange = res.headers.get('content-range');
  const totalCount = Number(contentRange?.split('/')[1] || 0);
  const totalPages = Math.ceil(totalCount / limit);

  // calculate number of projects are shown on screen
  const fromItem = totalCount === 0 ? 0 : offset + 1;
  const toItem = Math.min(offset + limit, totalCount);

  return (
    <main className="flex flex-col justify-between p-4 bg-background! min-h-screen">
      <div className="flex-1 md:block hidden relative">
        {/* Header */}
        <PageHeader
          title="Projects"
          description="Manage and curate your projects"
          SVGicon={<CreateProjectIcon className="my-auto text-white" />}
          buttonName="Create New Project"
          href="/projects/add"
        />

        {projects.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* ▲ ▲ ▲ Desktop View ▲ ▲ ▲ */}
            <Suspense fallback={<ProjectsPageSkeleton />}>
              <ProjectsGrid projects={projects} />
            </Suspense>

            {/* ====== Pagination Section ====== */}
            <div className="flex justify-between items-center text-sm font-medium text-gray-500">
              <p>
                Showing
                <span className="text-gray-900">
                  {fromItem}-{toItem}
                </span>
                of <span className="text-gray-900">{totalCount}</span> Active
                Projects
              </p>
              <DesktopPagination
                currentPage={currentPage}
                totalPages={totalPages}
                baseUrl="/projects"
              />
            </div>
          </>
        )}
      </div>

      {/* ▲ ▲ ▲ Mobile → Infinite scroll ▲ ▲ ▲ */}
      <div className="block md:hidden bg-background!">
        <ProjectsMobile
          initialProjects={projects}
          initialTotalCount={totalCount}
          limit={limit}
        />
      </div>
    </main>
  );
}
