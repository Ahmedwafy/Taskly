export default function MobileTaskSkeleton() {
  return (
    <div className="w-full max-w-sm space-y-4">
      {[1, 2, 3].map((id) => (
        <div
          key={id}
          className="animate-pulse rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="h-3 w-16 rounded bg-gray-200"></div>
            <div className="h-6 w-16 rounded-md bg-gray-200"></div>
          </div>

          {/* Title */}
          <div className="my-3">
            <div className="h-5 w-28 rounded bg-gray-200"></div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-2.5">
              <div className="h-8 w-8 shrink-0 rounded-full bg-gray-200"></div>
              <div className="space-y-1">
                <div className="h-2.5 w-12 rounded bg-gray-200"></div>
                <div className="h-3 w-20 rounded bg-gray-200"></div>
              </div>
            </div>

            <div className="h-4 w-1 rounded bg-gray-200"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
