// src > app > components > page > ProjectEpics.tsx
'use client';
import * as icons from '@/../public/icons/icons';
import * as images from '../../../../public/images/images';
import Image from 'next/image';
import PageHeader from '../molecules/PageHeader';
import EpicsEmptyState from './EpicsEmptyState';
import ProjectEpicsGrid from '../organisms/ProjectEpicsGrid';
import DesktopPagination from '../molecules/DesktopPagination';
import { toast } from 'sonner';
import { useState, useEffect, useTransition } from 'react'; // <-- Added hooks
import { useAppSelector, useAppDispatch } from '@/redux/reduxHooks';
import { useRouter, usePathname, useSearchParams } from 'next/navigation'; // <-- Added hook
import { EpicDetails, ProjectEpic, ProjectProps } from '@/types/shared';
import { updateEpicAction } from '@/app/actions/epics';
import { clearTasks, fetchEpicTasks } from '@/features/tasks/tasksSlice';
import { formatDate } from '@/lib/helpers';
import EpicDetailsPopUpModal from '../organisms/EpicDetailsPopUpModal';
import {
  fetchEpicDetails,
  clearSelectedEpic,
  updateEpicOptimistically,
  rollbackEpicUpdate,
} from '@/features/epics/epicsSlice';
import Link from 'next/link';
import Button from '../atoms/Button';
import Plus from '@/../public/svgIcons/Plus.svg';

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
  const dispatch = useAppDispatch();

  // useTransition: fetch the new search results in the background. Meanwhile, keep the current UI fully responsive so the user can keep typing or clicking."
  const [isPending, startTransition] = useTransition();

  // === Local state for the search input ===
  const [localSearch, setLocalSearch] = useState(searchTerm);

  // === Sync server search state to local input if updated externally ===
  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  // === Debouncing Logic ===
  useEffect(() => {
    // === If the local search is already matching server state, ignore trigger [ No Change ] ===
    if (localSearch === searchTerm) return;

    const delayDebounceFn = setTimeout(() => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString());

        // Reset page configuration when search parameters change
        params.set('page', '1');

        if (localSearch.trim() !== '') {
          params.set('search', localSearch); // searchParam →  ?search='...'
        } else {
          params.delete('search');
        }

        router.push(`${pathname}?${params.toString()}`);
      });
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [localSearch, pathname, router, searchParams, searchTerm]);

  // Handle errors
  useEffect(() => {
    if (hasError) {
      toast.error('Failed to search epics');
    }
  }, [hasError]);

  // === Redux State Sync ===
  const members = useAppSelector((state) => state.members.list);

  // === Epic Details Modal State ===
  const selectedEpic = useAppSelector((state) => state.epics.selectedEpic);
  const isLoadingEpicDetails = useAppSelector((state) => state.epics.loading);
  const epicsErrorMsg = useAppSelector((state) => state.epics.error);

  // === Epic's Tasks State ===
  const {
    list: epicTasks,
    error: tasksError,
    loading: isLoadingTasks,
  } = useAppSelector((state) => state.tasks);

  // === Modal UI States ===
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [, setIsSaving] = useState(false);

  // === Pagination ===
  const totalPages = Math.ceil(totalCount / limit);
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  // === ( Handle Epic Click ) ===
  const handleEpicClick = async (epicId: string) => {
    setIsModalOpen(true);
    setErrorMsg(null);

    const results = await Promise.allSettled([
      dispatch(fetchEpicDetails({ projectId: id, epicId })).unwrap(),
      dispatch(fetchEpicTasks({ projectId: id, epicId })).unwrap(),
    ]);

    const detailsResult = results[0];
    const tasksResult = results[1];

    if (detailsResult.status === 'rejected') {
      setErrorMsg(
        detailsResult.reason instanceof Error
          ? detailsResult.reason.message
          : 'Failed to load epic details.',
      );
    }

    if (tasksResult.status === 'rejected') {
      console.error('failed to load Tasks', tasksResult.reason || tasksError);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setErrorMsg(null);
    dispatch(clearSelectedEpic());
    dispatch(clearTasks());
  };

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

  const handleUpdateEpicField = async (
    epicId: string,
    updatedFields: Partial<EpicDetails> & { assignee_id?: string | null },
  ) => {
    setIsSaving(true);
    dispatch(updateEpicOptimistically({ updatedFields }));

    try {
      const result = await updateEpicAction({
        epicId,
        projectId: id,
        payload: updatedFields,
      });

      if (result?.error) throw new Error(result.error);

      toast.success(`Epic Updated Successfully`);
    } catch (err) {
      dispatch(rollbackEpicUpdate());
      toast.error(
        err instanceof Error
          ? err.message
          : `Failed to update epic. Please try again.`,
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Determine empty-state messaging rules
  const hasNoEpicsAtAll = projectEpics.length === 0 && !searchTerm;
  const hasNoSearchMatches = projectEpics.length === 0 && !!searchTerm;

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
        //
        searchValue={localSearch}
        onSearchChange={setLocalSearch}
        isSearching={isPending} // Transition state sets to True while router updates background data
      />

      {/* --- Loader / Empty / Non-Empty Views --- */}
      {isPending ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
          <p className="text-gray-500 font-medium">Searching epics...</p>
        </div>
      ) : hasNoEpicsAtAll ? (
        <EpicsEmptyState
          imageSrc={images.Empty_State}
          title="No epics found for this project"
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

      {/* --- Pagination Controls --- */}
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

      {/* ====== EPIC DETAILS MODAL POPUP ====== */}
      {isModalOpen && (
        <EpicDetailsPopUpModal
          key={selectedEpic?.id || 'epic-modal-closed'}
          closeModal={closeModal}
          selectedEpic={selectedEpic}
          epicTasks={epicTasks}
          formatDate={formatDate}
          errorMsg={errorMsg || epicsErrorMsg}
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

// Start with this local state for the Serach Input ... starts with searchTerm as an empty default value.
// const [localSearch, setLocalSearch] = useState(searchTerm);
//
//  User type in the search input >>> 'setLocalSearch' update 'searchTerm' Value with 'input Value' and pass it back to parent component.
//
// Use 'searchTerm' [ input text value ] to add a Search Param > ?search='input text value' (ex: ?search=epic5)
//
// From URL : get the value user typed from url search params. (ex: ?search=epic5)
//
// Send this value to the api.
