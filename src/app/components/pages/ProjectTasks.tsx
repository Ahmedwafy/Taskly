// src → app → components → pages → ProjectTasks.tsx
'use client';
import * as icons from '@/../public/icons/icons';
import TasksListView from '../organisms/TasksListView';
import Button from '../atoms/Button';
import Plus from '@/../public/svgIcons/Plus.svg';
import Link from 'next/link';
import PageHeader from '../molecules/PageHeader';
import TaskColumn from '../organisms/TaskColumn';
import { ProjectProps } from '@/types/shared';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import TaskDetailsPopUpModal from '../organisms/TaskDetailsPopUpModal';

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Handle Open/Close Task Details Pop-Up Modal
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // === Handle Add Query Params To URL === [Start] ===
  const currentValue =
    searchParams.get('view')?.toUpperCase() === 'LIST'
      ? 'LIST_VIEW'
      : 'BOARD_VIEW';

  const handleViewChange = (newValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', newValue.toLowerCase().replace('_view', ''));
    router.push(`${pathname}?${params.toString()}`); // view=board OR view=list
  };
  // === Handle Add Query Params To URL === [End] ===

  return (
    <section className="relative w-full h-auto flex flex-col">
      <PageHeader
        href={`/project/${projectId}/tasks/new`}
        title="Active Workboard"
        description="Curating Project Alphas production pipeline and milestones."
        projectName={projectData.name}
        icon={icons.Plus}
        buttonName="Create Task"
        currentValue={currentValue}
        handleViewChange={(e) => handleViewChange(e.target.value)}
      />
      {currentValue === 'BOARD_VIEW' ? (
        //  === < The Horizontally Scrollable == Tasks Board View == Container > ===
        <div className="mt-8 flex-1 w-full max-w-full overflow-x-scroll overflow-y-hidden pb-4">
          <div className="inline-flex gap-6 h-full items-start pr-6">
            {COLUMNS.map((col) => (
              <div
                key={col.status}
                className="w-[320px] shrink-0 h-full"
                style={{ minWidth: '320px' }} // fallback to prevent shrinking
              >
                <TaskColumn
                  projectId={projectId}
                  title={col.title}
                  status={col.status}
                  onTaskClick={setSelectedTaskId}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        //  === Tasks List View == Container  ===
        <div className="relative h-screen pt-10">
          <TasksListView
            projectId={projectId}
            onTaskClick={setSelectedTaskId}
          />

          <Link href={`/projects/${projectId}/tasks/new`}>
            <Button className="mt-10 w-20! h-15! absolute bottom-40 right-10">
              <Plus />
            </Button>
          </Link>
        </div>
      )}

      {/* ====== TASK DETAILS MODAL POPUP ====== */}
      {selectedTaskId && (
        <TaskDetailsPopUpModal
          taskId={selectedTaskId}
          projectId={projectId}
          onClose={() => setSelectedTaskId(null)}
        />
      )}
    </section>
  );
};

export default ProjectTasks;
