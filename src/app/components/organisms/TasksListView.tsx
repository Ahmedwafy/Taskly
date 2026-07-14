// src > app > components > organisms > TaskListView.tsx
'use client';
import { ProjectTask } from '@/features/tasks/tasksSlice';
import { formatDate, getInitials, getStatusStyle } from '@/lib/helpers';

interface TasksListViewProps {
  tasks: ProjectTask[];
  loading: boolean;
  error: string | null;
  onTaskClick: (taskId: string) => void;
}

const TasksListView = ({
  tasks,
  loading,
  error,
  onTaskClick,
}: TasksListViewProps) => {
  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-md shadow-sm border border-slate-100 font-sans h-auto">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-slate-600">
          {/* Table Header */}
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

          {/* Table Body */}
          <tbody className="divide-y divide-slate-50">
            {loading && (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-sm animate-pulse text-center"
                >
                  Loading tasks...
                </td>
              </tr>
            )}
            {error && (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-sm text-red-400 text-center"
                >
                  Error loading tasks
                </td>
              </tr>
            )}
            {!loading && !error && tasks.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-sm italic text-center">
                  No tasks found
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              tasks.map((task) => (
                <tr
                  key={task.id}
                  onClick={() => onTaskClick(task.id)}
                  className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                >
                  {/* Task ID */}
                  <td className="py-5 px-6 text-[12px] text-primary whitespace-nowrap">
                    {task.task_id}
                  </td>

                  {/* Title */}
                  <td className="py-5 px-6 text-sm font-semibold text-slate-800">
                    {task.title}
                  </td>

                  {/* Status Badge */}
                  <td className="py-5 px-6 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 rounded-md tracking-wide ${getStatusStyle(task.status)}`}
                    >
                      {task.status}
                    </span>
                  </td>

                  {/* Due Date */}
                  <td className="py-5 px-6 text-[14px] text-[#434654] whitespace-nowrap">
                    {formatDate(task.due_date, 'EU')}
                  </td>

                  {/* Assignee Avatar + Name */}
                  <td className="py-5 px-6 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {task.assignee.name && (
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center text-[11px] font-bold tracking-wider bg-[#DAE2FF] text-[#001848] ${task.assignee.name}`}
                        >
                          {getInitials(task.assignee.name)}
                        </div>
                      )}
                      <span className="text-sm font-medium text-slate-700">
                        {task.assignee.name}
                      </span>
                    </div>
                  </td>

                  {/* Options Menu */}
                  <td
                    className="py-5 px-6 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button className="text-slate-400 hover:text-slate-600 text-lg font-bold transition-colors">
                      •••
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 text-sm text-slate-500 bg-white">
        <div>Showing {tasks.length} tasks</div>
        <div className="flex items-center gap-6">
          <button
            className="p-1 hover:text-slate-800 transition-colors"
            aria-label="Previous page"
          >
            &lt;
          </button>
          <span className="text-slate-700 font-medium">Page 1 of 1</span>
          <button
            className="p-1 hover:text-slate-800 transition-colors"
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
