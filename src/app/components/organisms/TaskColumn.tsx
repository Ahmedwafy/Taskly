// src → app → components → organisms → TaskColumn.tsx
'use client';
import * as icons from '@/../public/icons/icons';
import Image from 'next/image';
import { ProjectTask } from '@/features/tasks/tasksSlice';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatDate, getInitials } from '@/lib/helpers';
import AddTaskIcon from '@/../public/svgIcons/AddTaskIcon.svg';
import AddTaskIcon2 from '@/../public/svgIcons/AddTaskIcon2.svg';
import TaskCard from '../molecules/TaskCard';

interface TaskColumnProps {
  projectId: string;
  title: string;
  status: string;
  onTaskClick: (taskId: string) => void;
}

const TaskColumn = ({
  projectId,
  title,
  status,
  onTaskClick,
}: TaskColumnProps) => {
  const router = useRouter();
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchColumnTasks = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/projects/${projectId}/project-tasks?status=${status}`,
        );
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Failed to fetch');

        setTasks(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'An unknown error occurred',
        );
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchColumnTasks();
    }
  }, [projectId, status]);

  const handleAddTaskClick = () => {
    router.push(`/projects/${projectId}/tasks/new?status=${status}`);
  };
  return (
    <div className="p-4 flex flex-col h-full">
      {/* Column Header */}
      <div className="flex justify-between items-center mb-4 pb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm tracking-wide uppercase text-[#64748B]">
            {title}
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-md font-medium bg-[#E0E8FF]">
            {tasks.length}
          </span>
        </div>

        {/* Plus Button Icon */}
        <button
          onClick={handleAddTaskClick}
          className="p-1 rounded-md transition-colors"
          title={`Add task to ${title}`}
        >
          <AddTaskIcon />
        </button>
      </div>

      <button
        className="flex gap-4 border-2 border-dashed border-[#C3C6D64D] w-full rounded-md py-4 mb-4 text-center items-center justify-center text-[#64748B]"
        onClick={handleAddTaskClick}
      >
        <span>
          <AddTaskIcon2 />
        </span>
        <span>ADD NEW TASK</span>
      </button>

      {/* === State Renderers [ Task Card ] === */}
      <TaskCard
        loading={loading}
        error={error}
        tasks={tasks}
        onTaskClick={onTaskClick}
      />

      {/* <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
        {loading && (
          <p className="text-sm animate-pulse text-center mt-4">
            Loading tasks...
          </p>
        )}
        {error && (
          <p className="text-sm text-red-400 text-center mt-4">
            Error loading tasks
          </p>
        )}

        {!loading && !error && tasks.length === 0 && (
          <p className="text-sm italic text-center mt-8">No tasks found</p>
        )}

        {!loading &&
          !error &&
          tasks.map((task) => (
            <div
              key={task.id}
              className="flex flex-col p-4 gap-6 transition text-sm shadow-sm bg-white rounded-md"
            >
              <span>{task.title}</span>
              <span className="flex justify-between w-full">
                <p className="flex gap-2 items-center">
                  <span>
                    <Image src={icons.Date} alt="Add-Task" />
                  </span>
                  <span> {formatDate(task.created_at)}</span>
                </p>
                {task.assignee.name && (
                  <p className="bg-primary rounded-full p-1 text-white">
                    {getInitials(task.assignee.name)}
                  </p>
                )}
              </span>
            </div>
          ))}
      </div> */}
    </div>
  );
};

export default TaskColumn;
