// src → app → components → pages → ProjectEpics.tsx

'use client';

import * as icons from '@/../public/icons/icons';
import * as images from '../../../../public/images/images';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getEpicDetails } from '@/services/getEpicDetails';
import { ProjectEpic, ProjectProps } from '@/types/shared';
import Image from 'next/image';
import PageHeader from '../molecules/PageHeader';
import EpicsEmptyState from './EpicsEmptyState';
import ProjectEpicsGrid from '../organisms/ProjectEpicsGrid';
import DesktopPagination from '../molecules/DesktopPagination';
// 1. Single source of truth import for structural interfaces
import EpicDetailsPopUpModal, {
  EpicDetails,
} from '../organisms/EpicDetailsPopUpModal';
import { useAppSelector } from '@/redux/reduxHooks';
import { updateEpicByID } from '@/services/updateEpicByID';
import { toast } from 'sonner';

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
  const members = useAppSelector((state) => state.members.list);

  // --- Modal & Fetching States ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEpic, setSelectedEpic] = useState<EpicDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [, setIsSaving] = useState(false);

  // --- Pagination ---
  const totalPages = Math.ceil(totalCount / limit);
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    router.push(`${pathname}?page=${newPage}&limit=${limit}`);
  };

  // --- Row Click Handler ---
  const handleEpicClick = async (epicId: string) => {
    setIsModalOpen(true);
    setIsLoadingDetails(true);
    setErrorMsg(null);
    setSelectedEpic(null);
    try {
      const data = await getEpicDetails({ projectId: id, epicId });
      setSelectedEpic(data);
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Failed to load epic details.',
      );
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEpic(null);
    setErrorMsg(null);
  };

  // --- Formatting Helpers ---
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
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
    if (!selectedEpic) return;

    const previousState = { ...selectedEpic };

    // Optimistic UI Update
    setSelectedEpic((prev) => (prev ? { ...prev, ...updatedFields } : null));
    setIsSaving(true);

    try {
      const { title, description, assignee_id, deadline } = updatedFields;
      const rawPayload = { title, description, assignee_id, deadline };

      const payload = Object.fromEntries(
        Object.entries(rawPayload).filter(([, value]) => value !== undefined),
      );

      if (Object.keys(payload).length === 0) return;

      await updateEpicByID({ epicId, payload });
      router.refresh();

      // Confirms the blur save completed successfully
      toast.success(`Epic Updated Successfully`);
    } catch (err) {
      setSelectedEpic(previousState);
      toast.error(`Failed to update epic. Please try again.`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="w-full relative">
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
          projectId={projectData.id}
          onEpicClick={handleEpicClick}
        />
      )}
      <DesktopPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      {totalPages > 1 && (
        <div className="text-center text-sm text-gray-500 -mt-4 mb-4">
          Page {currentPage} Of {totalPages} (Total epics: {totalCount})
        </div>
      )}

      {/* ====== EPIC DETAILS MODAL POPUP ======*/}
      {isModalOpen && (
        <EpicDetailsPopUpModal
          key={selectedEpic?.id || 'epic-modal-closed'} // → The key forces React to reset local state whenever the epic changes!
          closeModal={closeModal}
          selectedEpic={selectedEpic}
          formatDate={formatDate}
          errorMsg={errorMsg}
          isLoadingDetails={isLoadingDetails}
          membersData={members}
          handleUpdateEpicField={handleUpdateEpicField}
        />
      )}
    </main>
  );
};

export default ProjectEpics;
