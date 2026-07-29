// src > app > components > organisms > TaskListView.tsx
'use client';
import TaskListSkeleton from '../loadingSkeletons/TaskListSkeleton';
import { useRouter } from 'next/navigation';
import { ProjectTask } from '@/types/shared';
import { formatDate } from '@/lib/helpers/date';
import { getInitials } from '@/lib/helpers/user';
import { getTaskStatusBadgeStyle } from '@/lib/helpers/status';

interface TasksListViewProps {
  tasks: ProjectTask[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  projectId: string;
  onPageChange: (newPage: number) => void;
}

const TasksListView = ({
  tasks,
  loading,
  error,
  total,
  page,
  limit,
  onPageChange,
  projectId,
}: TasksListViewProps) => {
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  const router = useRouter();

  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-md shadow-sm border border-slate-100 font-sans">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-slate-600">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="py-4 px-6 text-[11px] font-bold text-description-color uppercase tracking-wider w-[12%]">
                Task ID
              </th>
              <th className="py-4 px-6 text-[11px] font-bold text-description-color uppercase tracking-wider w-[40%]">
                Title
              </th>
              <th className="py-4 px-6 text-[11px] font-bold text-description-color uppercase tracking-wider w-[15%]">
                Status
              </th>
              <th className="py-4 px-6 text-[11px] font-bold text-description-color uppercase tracking-wider w-[15%]">
                Due Date
              </th>
              <th className="py-4 px-6 text-[11px] font-bold text-description-color uppercase tracking-wider w-[15%]">
                Assignee
              </th>
              <th className="py-4 px-6 w-[3%]"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-sm animate-pulse text-center"
                >
                  <TaskListSkeleton />
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-sm text-red-400 text-center"
                >
                  {error}
                </td>
              </tr>
            ) : tasks.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-sm italic text-center">
                  No tasks found
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr
                  className="hover:bg-slate-50/50 transition-colors cursor-pointer w-full "
                  onClick={() =>
                    router.push(
                      `/projects/${projectId}/tasks/details/${task.id}?view=list`,
                    )
                  }
                  key={task.id}
                >
                  <td className="py-5 px-6 text-[12px] text-primary whitespace-nowrap">
                    {task.task_id}
                  </td>
                  <td className="py-5 px-6 text-sm font-semibold text-slate-800">
                    {task.title}
                  </td>
                  <td className="py-5 px-6 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 rounded-md tracking-wide font-bold ${getTaskStatusBadgeStyle(task.status)}`}
                    >
                      {task.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-5 px-6 text-[14px] text-[#434654] whitespace-nowrap">
                    {formatDate(task.due_date, 'EU')}
                  </td>
                  <td className="py-5 px-6 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {task.assignee?.name && (
                        <div className="w-7 h-7 rounded-xl flex items-center justify-center text-[11px] font-bold tracking-wider bg-[#DAE2FF] text-[#001848]">
                          {getInitials(task.assignee.name)}
                        </div>
                      )}
                      <span className="text-sm font-medium text-slate-700">
                        {task.assignee?.name || 'Unassigned'}
                      </span>
                    </div>
                  </td>
                  <td
                    className="py-5 px-6 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button className="text-slate-400 hover:text-slate-600 text-lg font-bold transition-colors">
                      •••
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 text-sm text-slate-500 bg-white">
        <div>
          Showing{' '}
          <span className="font-medium text-slate-700">{tasks.length}</span> of{' '}
          <span className="font-medium text-slate-700">{total}</span> tasks
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1 || loading}
            className="p-1 hover:text-slate-800 disabled:opacity-40 disabled:hover:text-slate-500 transition-colors cursor-pointer disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            &lt;
          </button>
          <span className="text-slate-700 font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages || loading}
            className="p-1 hover:text-slate-800 disabled:opacity-40 disabled:hover:text-slate-500 transition-colors cursor-pointer disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default TasksListView;
