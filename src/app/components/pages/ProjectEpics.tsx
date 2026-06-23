// src/app/components/pages/ProjectEpics.tsx
// src/app/components/pages/ProjectEpics.tsx
import PageHeader from '../molecules/PageHeader';
import { ProjectEpic, ProjectProps } from '@/types/shared';
import * as icons from '@/../public/icons/icons';
import * as images from '../../../../public/images/images'; // Make sure your epic image is loaded here
import ProjectEpicsGrid from '../organisms/ProjectEpicsGrid';
// import EmptyState from './EmptyState';
import Image from 'next/image';
import EpicsEmptyState from './EpicsEmptyState';

interface ProjectEpicsProps {
  projectData: ProjectProps;
  projectEpics: ProjectEpic[];
}

const ProjectEpics = ({ projectData, projectEpics }: ProjectEpicsProps) => {
  const { id, name } = projectData;
  const hasNoEpics = projectEpics.length === 0;

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
    </main>
  );
};

export default ProjectEpics;
