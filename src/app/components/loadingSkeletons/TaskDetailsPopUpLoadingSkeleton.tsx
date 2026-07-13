// src > app > component > loadingSkeletons > TaskDetailsPopUpLoadingSkeleton.tsx
export default function TaskDetailSkeleton() {
  return (
    <div className="max-w-4xl w-full mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      {/* Main Container */}
      <div className="grid grid-cols-3 min-h-[450px]">
        {/* Left Column (Content Area) - Spans 2 cols */}
        <div className="col-span-2 p-6 flex flex-col justify-between border-r border-gray-100">
          <div>
            {/* Top IDs/Hashes */}
            <div className="flex space-x-4 mb-4">
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>

            {/* Task Title */}
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-10"></div>

            {/* Description Label & Text */}
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded w-1/6"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>

          {/* Bottom Footer Actions */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-50 mt-12">
            {/* Copy Link button replacement */}
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            {/* Close button replacement */}
            <div className="h-9 bg-gray-200 rounded-lg w-16"></div>
          </div>
        </div>

        {/* Right Column (Sidebar Panel) - Spans 1 col */}
        <div className="col-span-1 bg-slate-50/50 p-6 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Status Section */}
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
            </div>

            {/* Assignee Section */}
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              <div className="p-3 bg-white border border-gray-100 rounded-lg flex items-center space-x-3">
                <div className="h-8 w-8 bg-gray-200 rounded-full flex-shrink-0"></div>
                <div className="space-y-2 w-full">
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>

            {/* Reporter Section */}
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              <div className="flex items-center space-x-3 px-1">
                <div className="h-8 w-8 bg-gray-200 rounded-full flex-shrink-0"></div>
                <div className="space-y-2 w-full">
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Dates Section at the bottom */}
          <div className="space-y-4 pt-6 border-t border-gray-200/60">
            {/* Due Date */}
            <div className="flex justify-between items-center">
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
            {/* Created At */}
            <div className="flex justify-between items-center">
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
