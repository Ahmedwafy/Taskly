// src/app/components/pages/ProjectEpics.tsx

'use client';
import PageHeader from '../molecules/PageHeader';
import { ProjectEpic, ProjectProps } from '@/types/shared';
import * as icons from '@/../public/icons/icons';
import * as images from '../../../../public/images/images';
import ProjectEpicsGrid from '../organisms/ProjectEpicsGrid';
// import EmptyState from './EmptyState';
import Image from 'next/image';
import EpicsEmptyState from './EpicsEmptyState';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import DesktopPagination from '../molecules/DesktopPagination';

interface ProjectEpicsProps {
  projectData: ProjectProps;
  projectEpics: ProjectEpic[];
  totalCount: number;
  currentPage: number;
  limit: number;
}

const ProjectEpics = ({
  projectData,
  projectEpics,
  totalCount,
  currentPage,
  limit,
}: ProjectEpicsProps) => {
  const { id, name } = projectData;
  const hasNoEpics = projectEpics.length === 0;
  const router = useRouter();
  const pathname = usePathname();

  // Pagination ---
  const totalPages = Math.ceil(totalCount / limit);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    // Update the URL
    router.push(`${pathname}?page=${newPage}&limit=${limit}`);
  };
  // Pagination ---
  const epicValueProps = [
    {
      icon: (
        <Image
          src={icons.Stars || icons.Epic}
          alt="High-Level Goals"
          width={20}
          height={20}
        />
      ),
      title: 'High-Level Goals',
      description:
        'Define the broad objectives that span across multiple cycles.',
    },
    {
      icon: (
        <Image
          src={icons.Tree || icons.Epic}
          alt="Hierarchy Design"
          width={20}
          height={20}
        />
      ),
      title: 'Hierarchy Design',
      description:
        'Link individual tasks to parent epics for a consolidated view.',
    },
    {
      icon: (
        <Image
          src={icons.Chart || icons.Epic}
          alt="Track Velocity"
          width={20}
          height={20}
        />
      ),
      title: 'Track Velocity',
      description: 'Visualize percentage completion at a macro project level.',
    },
  ];

  return (
    <main className="w-full">
      {/* Hide or adjust PageHeader when empty if you prefer, or keep it consistent */}
      <PageHeader
        href={`/projects/${id}/epics/new`}
        title="Project Epics"
        buttonName="New Epic"
        projectName={name}
        icon={icons.Plus}
        className=""
      />

      {hasNoEpics ? (
        <EpicsEmptyState
          imageSrc={images.Empty_State} // Points to your epics specific visual asset
          title="No epics in this project yet."
          description="Break down your large project into manageable epics to track progress better and maintain architectural clarity."
          buttonText="Create First Epic"
          buttonHref={`/projects/${id}/epics/new`}
          buttonIcon={
            <Image
              src={icons.Plus}
              alt="plus"
              className="invert brightness-0 h-4 w-4"
            />
          }
          features={epicValueProps}
        />
      ) : (
        <ProjectEpicsGrid projectEpics={projectEpics} />
      )}

      {/* Pagination → If More Than 1 Page of Epics */}
      {/* Pagination → Clean and Reusable */}
      <DesktopPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* (Optional) Keep info label beneath it */}
      {totalPages > 1 && (
        <div className="text-center text-sm text-gray-500 -mt-4 mb-4">
          Page {currentPage} Of {totalPages} (Total epics: {totalCount})
        </div>
      )}
    </main>
  );
};

export default ProjectEpics;
