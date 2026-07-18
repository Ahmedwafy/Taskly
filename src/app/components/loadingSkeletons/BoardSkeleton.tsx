export default function BoardSkeleton() {
  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      {/* Board Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* [Column 1: TO DO] */}
        <div className="bg-[#f8fafc] border border-gray-100 rounded-xl p-4 flex flex-col gap-4 animate-pulse">
          {/* Column Header Skeleton */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Status Indicator Dot */}
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              {/* Title Placeholder */}
              <div className="h-4 w-20 bg-gray-300 rounded"></div>
              {/* Count Badge Placeholder */}
              <div className="h-5 w-6 bg-gray-300 rounded-full"></div>
            </div>
            {/* Add Icon Placeholder */}
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
          </div>

          {/* Add New Task Button Skeleton */}
          <div className="w-full h-12 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>

          {/* Task Card 1 */}
          <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <div className="h-3 w-16 bg-gray-200 rounded"></div>
              </div>
              <div className="w-6 h-6 rounded-full bg-gray-200"></div>
            </div>
          </div>

          {/* Task Card 2 */}
          <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <div className="h-3 w-16 bg-gray-200 rounded"></div>
              </div>
              <div className="w-6 h-6 rounded-full bg-gray-200"></div>
            </div>
          </div>
        </div>

        {/* [Column 2: IN PROGRESS] */}
        <div className="bg-[#f8fafc] border border-gray-100 rounded-xl p-4 flex flex-col gap-4 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              <div className="h-4 w-24 bg-gray-300 rounded"></div>
              <div className="h-5 w-6 bg-gray-300 rounded-full"></div>
            </div>
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
          </div>
          <div className="w-full h-12 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
          {/* Accent Side Bar Card */}
          <div className="bg-white border border-gray-100 rounded-lg shadow-sm flex overflow-hidden">
            <div className="w-1.5 bg-gray-200"></div>
            <div className="p-4 flex-1 flex flex-col gap-4">
              <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <div className="h-3 w-16 bg-gray-200 rounded"></div>
                </div>
                <div className="w-6 h-6 rounded-full bg-gray-200"></div>
              </div>
            </div>
          </div>
        </div>

        {/* [Column 3: BLOCKED] */}
        <div className="bg-[#f8fafc] border border-gray-100 rounded-xl p-4 flex flex-col gap-4 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              <div className="h-4 w-20 bg-gray-300 rounded"></div>
              <div className="h-5 w-6 bg-gray-300 rounded-full"></div>
            </div>
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
          </div>
          <div className="w-full h-12 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
          {/* Blocked Filled Card */}
          <div className="bg-gray-100/50 border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col gap-4">
            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <div className="h-3 w-16 bg-gray-200 rounded"></div>
              </div>
              <div className="w-6 h-6 rounded-full bg-gray-200"></div>
            </div>
          </div>
        </div>

        {/* [Column 4: IN REVIEW] */}
        <div className="bg-[#f8fafc] border border-gray-100 rounded-xl p-4 flex flex-col gap-4 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              <div className="h-4 w-20 bg-gray-300 rounded"></div>
              <div className="h-5 w-6 bg-gray-300 rounded-full"></div>
            </div>
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
          </div>
          <div className="w-full h-12 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
          <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm flex flex-col gap-4">
            <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <div className="h-3 w-16 bg-gray-200 rounded"></div>
              </div>
              <div className="w-6 h-6 rounded-full bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
