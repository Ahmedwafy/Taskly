// src → app → components → pages → ProjectTasks.tsx
'use client';
import * as icons from '@/../public/icons/icons';
import PageHeader from '../molecules/PageHeader';
import { useEffect } from 'react';
import { ProjectProps } from '@/types/shared';
import { fetchEpicTasks, clearTasks } from '@/features/tasks/tasksSlice';
import { useAppDispatch, useAppSelector } from '@/redux/reduxHooks';

interface ProjectTasksProps {
  projectId: string;
  projectData: ProjectProps;
  epicId?: string;
}

const ProjectTasks = ({
  projectId,
  projectData,
  epicId,
}: ProjectTasksProps) => {
  const { name } = projectData;
  const dispatch = useAppDispatch();

  // Pull your tasks live out of global Redux state!
  const {
    list: tasks,
    loading,
    error,
  } = useAppSelector((state) => state.tasks);

  // Only dispatch if we have an active epic context to filter down tasks
  useEffect(() => {
    if (projectId && epicId) {
      dispatch(fetchEpicTasks({ projectId, epicId }));
    }

    // Optional: Reset store data when the user fully unmounts from the tasks view
    return () => {
      dispatch(clearTasks());
    };
  }, [projectId, epicId, dispatch]);

  return (
    <section className="relative w-full">
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

      <div className="mt-8 flex flex-col items-center justify-center min-h-50">
        {loading && <p className="text-gray-400">Loading tasks...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {!loading && !error && tasks.length === 0 && (
          <span className="bg-amber-500/10 border border-amber-500/20 text-amber-500 p-4 rounded-xl">
            Tasks Page -- No tasks found for this epic context --
          </span>
        )}

        {!loading && !error && tasks.length > 0 && (
          <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-2 border-b border-zinc-800 last:border-none text-zinc-100"
              >
                {task.title}{' '}
                <span className="text-xs text-zinc-500 ml-2">
                  ({task.status})
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectTasks;
