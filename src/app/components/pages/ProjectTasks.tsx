import * as icons from '@/../public/icons/icons';
import { ProjectProps } from '@/types/shared';
import PageHeader from '../molecules/PageHeader';

interface ProjectTasksProps {
  projectId: string;
  projectData: ProjectProps;
}

const ProjectTasks = ({ projectId, projectData }: ProjectTasksProps) => {
  //   console.log(`---- projectId -----`, projectId); // works
  const { id, name } = projectData;
  console.log(`projectData → `, id, name); // works

  return (
    <section className="relative">
      <div>
        <PageHeader
          href={`/projects/${projectId}/tasks/new`}
          title="Project Tasks"
          buttonName="Create Task"
          projectName={name}
          icon={icons.Plus}
          className=""
        />
      </div>
      <span className="absolute top-50 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-100 p-4 rounded-xl">
        Tasks Page -- Will View Tasks here --
      </span>
    </section>
  );
};

export default ProjectTasks;
