// export default ProjectTasks;
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
import { useState, useEffect, useMemo } from 'react';
import TaskDetailsPopUpModal from '../organisms/TaskDetailsPopUpModal';
import InputField from '../atoms/input';
import PLUS from '@/../public/svgIcons/Plus.svg';
import DotsIcon from '@/../public/svgIcons/DotsIcon.svg';
import { ProjectTask } from '@/features/tasks/tasksSlice';
import { formatDate, getInitials, getStatusStyle } from '@/lib/helpers';

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

  // === State Management ===
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // === Handle Add Query Params To URL ===
  const currentValue =
    searchParams.get('view')?.toUpperCase() === 'LIST'
      ? 'LIST_VIEW'
      : 'BOARD_VIEW';

  const handleViewChange = (newValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', newValue.toLowerCase().replace('_view', ''));
    router.push(`${pathname}?${params.toString()}`);
  };

  // === Single Fetch for ALL Tasks ===
  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        setLoading(true);
        setError(null);
        // do NOT pass a status here. This gets all tasks for the project.
        const response = await fetch(
          `/api/projects/${projectId}/project-tasks`,
        );
        const data = await response.json();

        if (!response.ok)
          throw new Error(data.error || 'Failed to fetch tasks');
        setTasks(data);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred',
        );
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchAllTasks();
    }
  }, [projectId]);

  // === Local Search Filter (For Mobile View) ===
  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.id.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [tasks, searchQuery]);

  return (
    <>
      {/* ▲ ▲ ▲ Desktop View ▲ ▲ ▲ */}
      <section className="relative w-full h-full hidden sm:flex flex-col">
        <PageHeader
          href={`/project/${projectId}/tasks/new`}
          title="Active Workboard"
          description="Curating Project Alphas production pipeline and milestones."
          projectName={projectData.name}
          icon={icons.Plus}
          buttonName="Create Task"
          currentValue={currentValue}
          handleViewChange={(value) => handleViewChange(value)}
        />
        {currentValue === 'BOARD_VIEW' ? (
          <div className="mt-8 flex-1 w-full max-w-full overflow-x-scroll overflow-y-hidden pb-4">
            <div className="inline-flex gap-6 h-full items-start pr-6">
              {COLUMNS.map((col) => {
                // Filter the pre-fetched tasks for this column locally
                const columnTasks = tasks.filter(
                  (t) => t.status === col.status,
                );
                return (
                  <div
                    key={col.status}
                    className="w-[320px] shrink-0 h-screen"
                    style={{ minWidth: '320px' }}
                  >
                    <TaskColumn
                      projectId={projectId}
                      title={col.title}
                      status={col.status}
                      tasks={columnTasks}
                      loading={loading}
                      error={error}
                      onTaskClick={setSelectedTaskId}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="relative h-screen pt-10">
            <TasksListView
              tasks={tasks}
              loading={loading}
              error={error}
              onTaskClick={setSelectedTaskId}
            />

            <Link
              href={`/projects/${projectId}/tasks/new`}
              className="absolute bottom-0 right-0"
            >
              {/* <Button className="mt-10 w-20! h-15! fixed right-10"> */}
              <Button className="px-6 py-6">
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

      {/* ▲ ▲ ▲ Mobile View ▲ ▲ ▲ */}
      <section className="sm:hidden min-h-screen px-4 py-8 relative flex flex-col gap-4">
        <header className="title-style">Active Workboard</header>

        <div className="px-4 flex flex-col gap-4">
          <InputField
            variant="search"
            placeholder="Search Tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Link href={`/projects/${projectId}/tasks/new`} className="w-full">
            <Button name="Create Task" className="w-full">
              <PLUS />
            </Button>
          </Link>
        </div>

        {/* Render tasks in mobile container */}
        {/* <div className="flex flex-col gap-3 px-0 mt-2 overflow-y-auto max-h-[60vh]"> */}
        <div className="flex flex-col gap-3 px-0 mt-2">
          {loading && (
            <p className="text-center text-sm">Loading mobile tasks...</p>
          )}

          {error && <p className="text-center text-sm text-red-500">{error}</p>}

          {!loading && !error && filteredTasks.length === 0 && (
            <p className="text-center text-sm italic text-slate-500">
              No tasks found
            </p>
          )}

          {!loading &&
            !error &&
            filteredTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => setSelectedTaskId(task.id)} // why ?
                className="flex flex-col gap-6 p-4 bg-white rounded-lg shadow-sm cursor-pointer 
                active:scale-95 transition-transform"
              >
                {/* task-id + status */}
                <div className="flex flex-col">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-[#43465480]">
                      {task.task_id}
                    </span>
                    <span
                      className={` ${getStatusStyle(task.status)} p-1 rounded-sm`}
                    >
                      {/* {task.status.replace('_', ' ')} */}
                      {task.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Task Title */}
                  <h4 className="font-medium text-neutral-100 text-[18px] -mt-2">
                    {task.title}
                  </h4>
                </div>

                {/* Due Date */}
                <div className="flex justify-between w-full gap-2 items-center">
                  <p className="flex gap-2 items-center">
                    {task.assignee.name && (
                      <span className="flex justify-center items-center bg-[#DAE2FF] rounded-xl w-7 h-7 font-bold text-[11px]">
                        {getInitials(task.assignee.name)}
                      </span>
                    )}
                    {formatDate(task.due_date) && (
                      <span className="flex flex-col gap-2">
                        <span className="uppercase font-bold text-[11px] text-[#434654B2] leading-1">
                          due date
                        </span>
                        <span className="text-[12px] leading-4">
                          {formatDate(task.due_date)}
                        </span>
                      </span>
                    )}
                  </p>

                  <p>
                    <DotsIcon />
                  </p>
                </div>
              </div>
            ))}
        </div>
      </section>
    </>
  );
};

export default ProjectTasks;
