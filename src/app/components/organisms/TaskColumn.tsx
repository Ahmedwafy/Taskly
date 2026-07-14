// src → app → components → organisms → TaskColumn.tsx
'use client';
import { ProjectTask } from '@/features/tasks/tasksSlice';
import AddTaskIcon from '@/../public/svgIcons/AddTaskIcon.svg';
import AddTaskIcon2 from '@/../public/svgIcons/AddTaskIcon2.svg';
import TaskCard from '../molecules/TaskCard';
import Link from 'next/link';

interface TaskColumnProps {
  projectId: string;
  title: string;
  status: string;
  tasks: ProjectTask[];
  loading: boolean;
  error: string | null;
  onTaskClick: (taskId: string) => void;
}

const TaskColumn = ({
  projectId,
  title,
  status,
  tasks,
  loading,
  error,
  onTaskClick,
}: TaskColumnProps) => {
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
        <Link href={`/projects/${projectId}/tasks/new?status=${status}`}>
          <button
            className="p-1 rounded-md transition-colors"
            title={`Add task to ${title}`}
          >
            <AddTaskIcon />
          </button>
        </Link>
      </div>

      <Link href={`/projects/${projectId}/tasks/new?status=${status}`}>
        <button className="flex gap-4 border-2 border-dashed border-[#C3C6D64D] w-full rounded-md py-4 mb-4 text-center items-center justify-center text-[#64748B]">
          <span>
            <AddTaskIcon2 />
          </span>
          <span>ADD NEW TASK</span>
        </button>
      </Link>

      {/* === State Renderers [ Task Card ] === */}
      <TaskCard
        loading={loading}
        error={error}
        tasks={tasks}
        onTaskClick={onTaskClick}
      />
    </div>
  );
};

export default TaskColumn;
