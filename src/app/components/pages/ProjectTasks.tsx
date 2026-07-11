// src/app/components/pages/ProjectTasks.tsx
'use client';
import * as icons from '@/../public/icons/icons';
import PageHeader from '../molecules/PageHeader';
import { ProjectProps } from '@/types/shared';
import TaskColumn from '../organisms/TaskColumn';

interface ProjectTasksProps {
  projectId: string;
  projectData: ProjectProps;
}

const COLUMNS: { title: string; status: string }[] = [
  { title: 'TO DO', status: 'TO_DO' },
  { title: 'IN PROGRESS', status: 'IN_PROGRESS' },
  { title: 'BLOCKED', status: 'BLOCKED' },
  { title: 'IN REVIEW', status: 'IN_REVIEW' },
  { title: 'READY FOR QA', status: 'READY_FOR_QA' },
  { title: 'REOPENED', status: 'REOPENED' },
  { title: 'READY FOR PRODUCTION', status: 'READY_FOR_PRODUCTION' },
  { title: 'DONE', status: 'DONE' },
];

const ProjectTasks = ({ projectId, projectData }: ProjectTasksProps) => {
  return (
    // changed h-screen to h-full to stop fighting with the layout's main height
    <section className="relative w-full p-6 h-full flex flex-col overflow-hidden">
      <PageHeader
        href={`/project/${projectId}/tasks/new`}
        title="Active Workboard"
        description="Curating Project Alphas production pipeline and milestones."
        projectName={projectData.name}
        icon={icons.Plus}
        buttonName="Create Task"
      />

      {/* === The Scrollable Container === */}
      {/* FIX: We use 'overflow-x-scroll' (forced) instead of auto, 
        and 'max-w-full' to ensure it snaps to the exact size of the main panel space.
      */}
      <div className="mt-8 flex-1 w-full max-w-full overflow-x-scroll overflow-y-hidden pb-4">
        {/* We use 'inline-flex' here. This tells the browser: 
          "Keep all columns on one line, let them take their full width, and let the parent handle the scroll."
        */}
        <div className="inline-flex gap-6 h-full items-start pr-6">
          {COLUMNS.map((col) => (
            <div
              key={col.status}
              className="w-[320px] shrink-0 h-full"
              style={{ minWidth: '320px' }} // Bulletproof fallback to prevent shrinking
            >
              <TaskColumn
                projectId={projectId}
                title={col.title}
                status={col.status}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectTasks;
