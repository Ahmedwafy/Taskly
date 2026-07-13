'use client';

import { ProjectTask } from '@/features/tasks/tasksSlice';
import { formatDate, getInitials, getStatusStyle } from '@/lib/helpers';
import { useEffect, useState } from 'react';
import Link from '@/../public/svgIcons/Link.svg';
import TaskDetailSkeleton from '../loadingSkeletons/TaskDetailsPopUpLoadingSkeleton';

interface TaskDetailsPopUpModalProps {
  taskId: string;
  projectId: string;
  onClose: () => void;
}
const TaskDetailsPopUpModal = ({
  taskId,
  projectId,
  onClose,
}: TaskDetailsPopUpModalProps) => {
  const [task, setTask] = useState<ProjectTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/projects/${projectId}/project-tasks/${taskId}`, // projectId & taskId in URL now
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch');
        setTask(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load task details',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [taskId, projectId]);

  console.log(`task details`, task);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      {loading && <TaskDetailSkeleton />}

      {error && (
        <p className="text-sm text-red-400 text-center mt-4">{error}</p>
      )}

      {!loading && !error && !task && (
        <p className="text-sm italic text-center mt-8">No tasks found</p>
      )}

      {task && (
        <div className="flex w-5xl z-10 rounded-lg bg-white">
          {/* === Left Section === */}
          <div className="relative w-2/3 flex flex-col pt-6">
            <p className="flex gap-2 px-6">
              <span className="break-all">{task.id}</span>
              {task.epic_id && (
                <span className="p-1 rounded-sm break-all">{task.epic_id}</span>
              )}
            </p>

            <h2 className="headline-lg border-b border-[#E8EDFF] pt-4 pb-8 px-6">
              {task.title}
            </h2>

            <div className="flex flex-col gap-2 h-full px-6 pt-6">
              <span className="uppercase .list-item">description</span>
              <p>{task.description}</p>
            </div>

            <div className="flex justify-between bottom-0 bg-[#F1F3FF] w-full rounded-bl-md h-18 px-8 items-center py-4">
              <span className="flex gap-2 items-center">
                <Link /> Copy Link
              </span>
              <button className="bg-[#D7E2FF] py-2 px-4 rounded-md">
                Close
              </button>
            </div>
          </div>

          {/* === Right Section === */}
          <div className="w-1/3 bg-[#E8EDFF] p-6 rounded-r-lg flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <strong className="uppercase text-sm text-[#434654]">
                status
              </strong>
              <span
                className={`px-2.5 py-4 rounded-md tracking-wide ${getStatusStyle(task.status)}`}
              >
                {task.status.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <strong className="uppercase text-sm text-[#434654]">
                assignee
              </strong>
              <div className="bg-white py-2 px-2 rounded-md flex gap-4 items-center">
                <span className="bg-[#DAE2FF] rounded-xl p-1 text-[#001848]">
                  {task.assignee.name
                    ? getInitials(task.assignee.name)
                    : 'Unassigned'}
                </span>
                <p className="flex flex-col">
                  <span className="font-semibold">{task.assignee.name}</span>
                  <span>{task.assignee.department}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <strong className="uppercase text-sm text-[#434654]">
                reporter
              </strong>
              <div className="py-2 px-2 rounded-md flex gap-4 items-center">
                <span className="bg-[#DAE2FF] rounded-xl p-1 text-[#001848]">
                  {task.assignee.name
                    ? getInitials(task.assignee.name)
                    : 'Unassigned'}
                </span>
                <p className="flex flex-col">
                  <span className="font-semibold">{task.assignee.name}</span>
                  <span>{task.assignee.department}</span>
                </p>
              </div>
            </div>

            <hr className="text-gray-300" />

            <p className="flex justify-between w-full">
              <span className="text-[#434654]">Due Date</span>{' '}
              <span className="text-end">
                {formatDate(task.due_date, `EU`)}
              </span>
            </p>

            <p className="flex justify-between w-full">
              <span className="text-[#434654]">Created At</span>{' '}
              <span className="text-end">
                {formatDate(task.created_at, `EU`)}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetailsPopUpModal;
