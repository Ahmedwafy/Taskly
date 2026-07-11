import Image from 'next/image';
import * as icons from '@/../public/icons/icons';
import { formatDate, getInitials } from '@/lib/helpers';
import { ProjectTask } from '@/features/tasks/tasksSlice';

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
            onClick={() => onTaskClick(task.id)}
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
    </div>
  );
};

export default TaskCard;
