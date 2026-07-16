// src > app > components > pages > TaskCard.tsx
'use client';
import Image from 'next/image';
import * as icons from '@/../public/icons/icons';
import { formatDate, getInitials } from '@/lib/helpers';
import { ProjectTask } from '@/features/tasks/tasksSlice';
import TaskCardSkeleton from '../loadingSkeletons/TaskCardSkeleton';
import DateIcon from '@/../public/svgIcons/Date.svg';

interface TaskCardProps {
  loading: boolean;
  error: string | null;
  tasks: ProjectTask[];
  onTaskClick: (taskId: string) => void;
}

const TaskCard = ({ loading, error, tasks, onTaskClick }: TaskCardProps) => {
  return (
    <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
      {loading && (
        <p className="text-sm animate-pulse text-center mt-4">
          <TaskCardSkeleton />
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
            onClick={() => onTaskClick(task.id)}
            className={`relative overflow-hidden flex flex-col p-4 gap-6 transition text-sm shadow-sm bg-white rounded-md 
              ${task.status === 'BLOCKED' && 'bg-[#FFDAD633]! border border-[#BA1A1A1A]!'}
              ${task.status === 'IN_PROGRESS' && 'pl-6'}
              `}
          >
            {task.status === 'IN_PROGRESS' && (
              <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-primary" />
            )}

            <span>{task.title}</span>
            <span className="flex justify-between w-full">
              <p className="flex gap-2 items-center">
                <span>
                  <DateIcon
                    className={`text-[#94A3B8]
                      ${task.status === 'IN_PROGRESS' && 'text-primary'}`}
                  />
                </span>
                <span
                  className={`${task.status === 'IN_PROGRESS' && 'text-primary font-semibold'} text-[#94A3B8]`}
                >
                  {formatDate(task.created_at)}
                </span>
              </p>
              {task.assignee.name && (
                <p className="bg-primary rounded-full p-1 text-white">
                  {getInitials(task.assignee.name)}
                </p>
              )}
            </span>
          </div>
        ))}
    </div>
  );
};

export default TaskCard;
