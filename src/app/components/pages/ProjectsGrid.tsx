import Link from 'next/link';
import React from 'react';
import AddProjectCard from '../molecules/AddProjectCard';
import ProjectCard from '../molecules/ProjectCard';
import { Project } from '@/types/project';

type Props = {
  projects: Project[];
};

const ProjectsGrid: React.FC<Props> = ({ projects }) => {
  return (
    <section className="flex flex-wrap gap-y-8 py-4 px-6 justify-between w-full mt-4">
      {projects.map((project: Project) => (
        <Link href={`/projects/${project.id}/epics`} key={project.id}>
          <div className="w-full md:w-auto">
            <ProjectCard
              project={project}
              className="border border-gray-100 py-4 px-8 rounded-lg shadow-sm shadow-black/5 h-80 flex flex-col justify-between w-full md:min-w-112.5 mx-auto bg-white hover:shadow-md transition-shadow duration-300"
            />
          </div>
        </Link>
      ))}

      <div className="w-full md:w-auto">
        <AddProjectCard className="border-2 border-dashed border-gray-200 py-4 px-8 rounded-lg shadow-sm shadow-black/5 h-80 flex flex-col justify-center w-full md:min-w-112.5 mx-auto bg-white hover:shadow-md transition-shadow duration-300" />
      </div>
    </section>
  );
};

export default ProjectsGrid;
