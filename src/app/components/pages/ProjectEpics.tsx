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
import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/reduxHooks';
import { useRouter, usePathname } from 'next/navigation';
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
  const dispatch = useAppDispatch();

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

  console.log('epic Tasks:', epicTasks); // Debugging line

  // === Modal UI States ===
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [, setIsSaving] = useState(false);

  // === Pagination ===
  const totalPages = Math.ceil(totalCount / limit);
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    router.push(`${pathname}?page=${newPage}&limit=${limit}`);
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

    // Check if the critical epic details failed
    if (detailsResult.status === 'rejected') {
      setErrorMsg(
        detailsResult.reason instanceof Error
          ? detailsResult.reason.message
          : 'Failed to load epic details.',
      );
    }

    // If tasks failed, it won't crash the modal.
    if (tasksResult.status === 'rejected') {
      console.error('failed to load Tasks', tasksResult.reason || tasksError);
    }
  };

  // === when user closes the modal ===
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

  // === Handle Epic Field Update (Inline Editing) ===
  const handleUpdateEpicField = async (
    epicId: string,
    updatedFields: Partial<EpicDetails> & { assignee_id?: string | null },
  ) => {
    setIsSaving(true);

    // 1. Trigger an optimistic update directly in Redux slice
    // (make sure slice handles this action to update state immediately)
    dispatch(updateEpicOptimistically({ updatedFields }));

    try {
      const result = await updateEpicAction({
        epicId,
        projectId: id,
        payload: updatedFields,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      toast.success(`Epic Updated Successfully`);
    } catch (err) {
      // 2. Rollback to original server values from Redux if it fails
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
      />
      {hasNoEpics ? (
        <EpicsEmptyState
          imageSrc={images.Empty_State}
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
        <ProjectEpicsGrid
          projectEpics={projectEpics}
          onEpicClick={handleEpicClick}
        />
      )}
      <div className="relative">
        {/* Show Only in Big Screens */}
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

        {/* Show on Mobile */}
        <div className="block md:hidden">
          <Link href={`/projects/${id}/epics/new`}>
            <Button className="mt-10 w-20! h-15! absolute right-0">
              <Plus />
            </Button>
          </Link>
        </div>
      </div>

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
