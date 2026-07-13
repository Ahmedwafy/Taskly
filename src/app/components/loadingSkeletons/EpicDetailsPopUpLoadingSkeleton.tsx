// src > app > component > loadingSkeletons > EpicDetailsPopUpLoadingSkeleton.tsx

export default function EpicSkeletonPopup() {
  return (
    <div className="max-w-2xl w-full mx-auto bg-white p-6 rounded-lg border border-gray-100 shadow-sm animate-pulse">
      {/* Header: Tag & Title */}
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-3 w-1/2">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
      </div>

      {/* Description */}
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-10"></div>

      {/* Meta Info Grid */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="space-y-3">
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-gray-200 rounded-full flex-shrink-0"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="h-9 bg-gray-100 rounded-lg w-full border border-gray-200/50"></div>
        </div>

        <div className="space-y-3 border-l border-gray-100 pl-6">
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>

      {/* Created At */}
      <div className="space-y-3 mb-8">
        <div className="h-3 bg-gray-200 rounded w-1/6"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>

      <hr className="border-gray-100 mb-6" />

      {/* Tasks Section */}
      <div className="flex justify-between items-center mb-4">
        <div className="h-6 bg-gray-200 rounded w-16"></div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </div>

      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-4 border border-gray-100 rounded-lg flex justify-between items-center"
          >
            <div className="space-y-3 w-1/2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="flex items-center space-x-2">
                <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
