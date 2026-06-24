'use client';
import { useState } from 'react';
import PageHeader from '../molecules/PageHeader';
import { ProjectEpic, ProjectProps } from '@/types/shared';
import * as icons from '@/../public/icons/icons';
import * as images from '../../../../public/images/images';
import ProjectEpicsGrid from '../organisms/ProjectEpicsGrid';
import Image from 'next/image';
import EpicsEmptyState from './EpicsEmptyState';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import DesktopPagination from '../molecules/DesktopPagination';
import { getEpicDetails } from '@/services/getEpicDetails';
import EpicDetailsPopUpModal from '../organisms/EpicDetailsPopUpModal';

interface ProjectEpicsProps {
  projectData: ProjectProps;
  projectEpics: ProjectEpic[];
  totalCount: number;
  currentPage: number;
  limit: number;
}

export interface EpicUser {
  name?: string;
  avatar_url?: string;
}

export interface EpicDetails {
  id: string;
  epic_id?: string;
  title?: string;
  description?: string;
  created_by?: EpicUser;
  assignee?: EpicUser;
  deadline?: string;
  created_at?: string;
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

  // --- Modal & Fetching States ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEpic, setSelectedEpic] = useState<EpicDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
        /* Passing down the trigger function to the list grid */
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
          closeModal={closeModal}
          selectedEpic={selectedEpic}
          formatDate={formatDate}
          errorMsg={errorMsg}
          isLoadingDetails={isLoadingDetails}
        />
      )}
      ```
    </main>
  );
};

export default ProjectEpics;
