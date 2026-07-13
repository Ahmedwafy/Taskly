import Link from 'next/link';
import React from 'react';
import AddProjectCard from '../molecules/AddProjectCard';
import ProjectCard from '../molecules/ProjectCard';

import { ProjectProps } from '@/types/shared';

type Props = {
  projects: ProjectProps[];
};

const ProjectsGrid: React.FC<Props> = ({ projects }) => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8 py-4 px-6 w-full mt-4">
      {projects.map((project: ProjectProps) => (
        <Link
          href={`/projects/${project.id}/epics`}
          key={project.id}
          className="block w-full"
        >
          <ProjectCard
            project={project}
            className="flex flex-col justify-between h-80 md:h-55 w-full py-4 px-8 border border-gray-100 rounded-lg shadow-sm shadow-black/5 
             hover:shadow-md transition-shadow duration-300 bg-white"
          />
        </Link>
      ))}

      <AddProjectCard />
    </section>
  );
};

export default ProjectsGrid;
