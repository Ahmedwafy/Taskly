'use client';
import * as icons from '@/../public/icons/icons';
import HierarchyDesign from '@/../public/svgIcons/HierarchyDesign.svg';
import Stars from '@/../public/svgIcons/Stars.svg';
import TrackVelocity from '@/../public/svgIcons/TrackVelocity.svg';
import ThunderIcon from '@/../public/svgIcons/ThnderIcon.svg';

import Rocket from '@/../public/svgIcons/Rocket.svg';
import DrawingCompass from '@/../public/svgIcons/DrawingCompass.svg';
import Squares from '@/../public/svgIcons/Squares.svg';
import Pluss from '@/../public/svgIcons/Pluss.svg';

import * as images from '../../../../public/images/images';
import PageHeader from '../molecules/PageHeader';
import EpicsEmptyState from './EpicsEmptyState';
import ProjectEpicsGrid from '../organisms/ProjectEpicsGrid';
import DesktopPagination from '../molecules/DesktopPagination';
import { toast } from 'sonner';
import { useState, useEffect, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { EpicDetails, ProjectEpic, ProjectProps } from '@/types/shared';
import EpicDetailsPopUpModal from '../organisms/EpicDetailsPopUpModal';
import Link from 'next/link';
import Button from '../atoms/Button';
import Plus from '@/../public/svgIcons/Plus.svg';
import { formatDate } from '@/lib/helpers/date';
import { useProjectMembers } from '@/app/hooks/members/useProjectMembers';
import { useEpicDetails } from '@/app/hooks/epics/useEpicDetails';
import { useEpicTasks } from '@/app/hooks/epics/useEpicTasks';
import { useUpdateEpicField } from '@/app/hooks/epics/useUpdateEpicField';

interface ProjectEpicsProps {
  projectData: ProjectProps;
  projectEpics: ProjectEpic[];
  totalCount: number;
  currentPage: number;
  limit: number;
  searchTerm: string;
  hasError: boolean;
}

const ProjectEpics = ({
  projectData,
  projectEpics,
  totalCount,
  currentPage,
  limit,
  searchTerm,
  hasError,
}: ProjectEpicsProps) => {
  const { id, name } = projectData;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();
  const [localSearch, setLocalSearch] = useState(searchTerm);

  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    if (localSearch === searchTerm) return;

    const delayDebounceFn = setTimeout(() => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', '1');

        if (localSearch.trim() !== '') {
          params.set('search', localSearch);
        } else {
          params.delete('search');
        }

        router.push(`${pathname}?${params.toString()}`);
      });
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [localSearch, pathname, router, searchParams, searchTerm]);

  useEffect(() => {
    if (hasError) {
      toast.error('Failed to search epics');
    }
  }, [hasError]);

  const { data: members = [] } = useProjectMembers(id);

  // === Modal UI States ===
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEpicId, setSelectedEpicId] = useState<string | null>(null);

  // === Epic Details + Tasks (fetched only while modal is open) ===
  const {
    data: selectedEpic,
    isLoading: isLoadingEpicDetails,
    error: epicDetailsError,
  } = useEpicDetails({
    projectId: id,
    epicId: selectedEpicId,
    enabled: isModalOpen,
  });

  const {
    data: epicTasks = [],
    isLoading: isLoadingTasks,
    error: tasksError,
  } = useEpicTasks({
    projectId: id,
    epicId: selectedEpicId,
    enabled: isModalOpen,
  });

  const { mutate: updateEpicField } = useUpdateEpicField();

  // === Pagination ===
  const totalPages = Math.ceil(totalCount / limit);
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleEpicClick = (epicId: string) => {
    setSelectedEpicId(epicId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEpicId(null);
  };

  const epicValueProps = [
    {
      icon: <Stars />,
      title: 'High-Level Goals',
      description:
        'Define the broad objectives that span across multiple cycles.',
    },
    {
      icon: <HierarchyDesign />,
      title: 'Hierarchy Design',
      description:
        'Link individual tasks to parent epics for a consolidated view.',
    },
    {
      icon: <TrackVelocity />,
      title: 'Track Velocity',
      description: 'Visualize percentage completion at a macro project level.',
    },
  ];

  const handleUpdateEpicField = (
    epicId: string,
    updatedFields: Partial<EpicDetails> & { assignee_id?: string | null },
  ) => {
    updateEpicField({ epicId, projectId: id, payload: updatedFields });
  };

  const hasNoEpicsAtAll = projectEpics.length === 0 && !searchTerm;
  const hasNoSearchMatches = projectEpics.length === 0 && !!searchTerm;

  const modalErrorMsg =
    (epicDetailsError instanceof Error ? epicDetailsError.message : null) ||
    (tasksError instanceof Error ? tasksError.message : null);

  return (
    <section className="w-full relative flex flex-col">
      <PageHeader
        href={`/projects/${id}/epics/new`}
        title="Project Epics"
        buttonName="New Epic"
        projectName={name}
        icon={icons.Plus}
        className=""
        needSearchIcon="YES"
        searchValue={localSearch}
        onSearchChange={setLocalSearch}
        isSearching={isPending}
      />

      {isPending ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
          <p className="text-gray-500 font-medium">Searching epics...</p>
        </div>
      ) : hasNoEpicsAtAll ? (
        <EpicsEmptyState
          imageSrc={images.Empty_State}
          title="No epics found for this project yet"
          description="Break down your large project into manageable
          epics to track progress better and maintain
          architectural clarity."
          buttonText="Create First Epic"
          buttonHref={`/projects/${id}/epics/new`}
          buttonIcon={<ThunderIcon />}
          features={epicValueProps}
          rocketIcon={Rocket}
          drawingCompassIcon={DrawingCompass}
          squaresIcon={Squares}
          plusIcon={Pluss}
        />
      ) : hasNoSearchMatches ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="p-4 bg-gray-50 rounded-full mb-4">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            No epics found matching your search
          </h3>
          <p className="text-gray-500 mt-1">
            Try checking your spelling or search for another epic title.
          </p>
        </div>
      ) : (
        <ProjectEpicsGrid
          projectEpics={projectEpics}
          onEpicClick={handleEpicClick}
        />
      )}

      {!hasNoEpicsAtAll && !hasNoSearchMatches && !isPending && (
        <div className="relative">
          <div className="hidden md:flex justify-between items-center text-sm font-medium text-gray-500">
            {totalPages > 1 && (
              <div className="text-center text-sm text-gray-500 -mt-4 mb-4">
                Page {currentPage} Of {totalPages} (Total epics: {totalCount})
              </div>
            )}
            <DesktopPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>

          <div className="block md:hidden">
            <Link href={`/projects/${id}/epics/new`}>
              <Button className="mt-10 w-20! h-15! absolute right-0">
                <Plus />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {isModalOpen && (
        <EpicDetailsPopUpModal
          key={selectedEpic?.id || 'epic-modal-closed'}
          closeModal={closeModal}
          selectedEpic={selectedEpic ?? null}
          epicTasks={epicTasks}
          formatDate={formatDate}
          errorMsg={modalErrorMsg}
          isLoadingDetails={isLoadingEpicDetails || isLoadingTasks}
          membersData={members}
          handleUpdateEpicField={handleUpdateEpicField}
          projectId={id}
        />
      )}
    </section>
  );
};

export default ProjectEpics;
