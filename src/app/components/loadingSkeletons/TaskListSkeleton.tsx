const TaskListSkeleton = ({ rows = 5 }) => {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm p-4 animate-pulse">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 border-b border-gray-100 pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        <div className="col-span-2">Task ID</div>
        <div className="col-span-3">Title</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2">Due Date</div>
        <div className="col-span-2">Assignee</div>
        <div className="col-span-1 text-right"></div>
      </div>

      {/* Table Body Rows */}
      <div className="divide-y divide-gray-50">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-12 gap-4 items-center py-4"
          >
            {/* Task ID */}
            <div className="col-span-2">
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
            </div>

            {/* Title */}
            <div className="col-span-3">
              <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
            </div>

            {/* Status Badge */}
            <div className="col-span-2">
              <div className="h-6 w-20 bg-gray-200 rounded-md"></div>
            </div>

            {/* Due Date */}
            <div className="col-span-2">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </div>

            {/* Assignee (Avatar Circle + Name) */}
            <div className="col-span-2 flex items-center space-x-2">
              <div className="h-6 w-6 rounded-full bg-gray-200 shrink-0"></div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </div>

            {/* Action Menu (Three dots) */}
            <div className="col-span-1 flex justify-end">
              <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskListSkeleton;
