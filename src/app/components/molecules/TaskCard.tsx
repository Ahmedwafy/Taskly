// src > app > components > pages > TaskCard.tsx
'use client';
import { formatDate, getInitials } from '@/lib/helpers';
import TaskCardSkeleton from '../loadingSkeletons/TaskCardSkeleton';
import DateIcon from '@/../public/svgIcons/Date.svg';
import { useRouter } from 'next/navigation';
import { useDraggable } from '@dnd-kit/core';
import { ProjectTask } from '@/types/shared';

interface TaskCardProps {
  loading: boolean;
  error: string | null;
  tasks: ProjectTask[];
  projectId: string;
}

const TaskCard = ({ loading, error, tasks, projectId }: TaskCardProps) => {
  return (
    <div className="flex-1 overflow-y-auto flex flex-col justify-center custom-scrollbar w-full">
      {loading && (
        <div className="text-sm animate-pulse text-center mt-4">
          <TaskCardSkeleton />
        </div>
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
          <DraggableTaskCard key={task.id} task={task} projectId={projectId} />
        ))}
    </div>
  );
};

interface DraggableTaskCardProps {
  task: ProjectTask;
  projectId: string;
}

const DraggableTaskCard = ({ task, projectId }: DraggableTaskCardProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      data: {
        task: task, // Pass the whole object here
      },
    });
  const router = useRouter();
  // If this specific card instance is being dragged, render the empty dashed slot placeholder
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        className="w-full h-24 border-2 border-dashed border-slate-300 bg-slate-50/50 rounded-lg"
      />
    );
  }
  // Convert dnd-kit's transform coordinates into CSS styling
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={(e) => {
        // Prevent trigger drag events on click action
        e.stopPropagation();
        router.push(`/projects/${projectId}/tasks/details/${task.id}`);
      }}
      className={`relative overflow-hidden flex flex-col p-4 gap-6 transition text-sm shadow-sm bg-white rounded-md select-none touch-none w-full
        ${task.status === 'BLOCKED' && 'bg-[#FFDAD633]! border border-[#BA1A1A1A]!'}
        ${task.status === 'IN_PROGRESS' && 'pl-6'}
        ${isDragging ? 'opacity-40 shadow-lg cursor-grabbing border-primary/40 border-2' : 'cursor-grab hover:shadow-md'}
      `}
    >
      {task.status === 'IN_PROGRESS' && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
      )}

      <span>{task.title}</span>
      <span className="flex justify-between w-full">
        <span className="flex gap-2 items-center">
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
        </span>
        {task.assignee?.name && (
          <p className="bg-primary rounded-full p-1 text-white text-xs">
            {getInitials(task.assignee.name)}
          </p>
        )}
      </span>
    </div>
  );
};

export default TaskCard;
