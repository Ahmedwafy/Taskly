// src > app > components > organisms > TaskListView.tsx
'use client';

import { ProjectTask } from '@/features/tasks/tasksSlice';
import { formatDate, getInitials, getStatusStyle } from '@/lib/helpers';
import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Button from '../atoms/Button';
// import Plus from '@/../public/svgIcons/Plus.svg';

interface TasksListViewProps {
  projectId: string;
  onTaskClick: (taskId: string) => void;
}

const TasksListView = ({ projectId, onTaskClick }: TasksListViewProps) => {
  // const router = useRouter();
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListTasks = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/projects/${projectId}/project-tasks`,
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
      fetchListTasks();
    }
  }, [projectId]);

  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-md shadow-sm border border-slate-100 font-sans h-auto">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-slate-600">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="py-4 px-6 text-[12px] font-semibold text-slate-500 uppercase tracking-wider w-[12%]">
                Task ID
              </th>
              <th className="py-4 px-6 text-[12px] font-semibold text-slate-500 uppercase tracking-wider w-[40%]">
                Title
              </th>
              <th className="py-4 px-6 text-[12px] font-semibold text-slate-500 uppercase tracking-wider w-[15%]">
                Status
              </th>
              <th className="py-4 px-6 text-[12px] font-semibold text-slate-500 uppercase tracking-wider w-[15%]">
                Due Date
              </th>
              <th className="py-4 px-6 text-[12px] font-semibold text-slate-500 uppercase tracking-wider w-[15%]">
                Assignee
              </th>
              <th className="py-4 px-6 w-[3%]"></th>
            </tr>
          </thead>

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

          {/* Table Body */}
          <tbody className="divide-y divide-slate-50">
            {!loading &&
              !error &&
              tasks.map((task) => (
                <tr
                  key={task.id}
                  onClick={() => onTaskClick(task.id)}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  {/* Task ID */}
                  <td className="py-5 px-6 text-sm text-blue-600 font-medium whitespace-nowrap">
                    {task.id}
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
                  <td className="py-5 px-6 text-sm text-slate-500 whitespace-nowrap">
                    {formatDate(task.due_date, 'EU')}
                  </td>

                  {/* Assignee Avatar + Name */}
                  <td className="py-5 px-6 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold tracking-wider ${task.assignee.name}`}
                      >
                        {getInitials(task.assignee.name)}
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        {task.assignee.name}
                      </span>
                    </div>
                  </td>

                  {/* Options Menu (Three Dots) */}
                  <td className="py-5 px-6 text-right">
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
        <div>Showing 5 of 24 tasks</div>
        <div className="flex items-center gap-6">
          <button
            className="p-1 hover:text-slate-800 transition-colors"
            aria-label="Previous page"
          >
            &lt;
          </button>
          <span className="text-slate-700 font-medium">Page 1 of 5</span>
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
