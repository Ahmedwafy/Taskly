export default function TaskCardSkeleton() {
  return (
    <div className="w-full max-w-sm rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="animate-pulse space-y-6">
        {/* Task Title Placeholder */}
        <div className="h-5 w-2/3 rounded-md bg-gray-200" />

        {/* Footer Row */}
        <div className="flex items-center justify-between">
          {/* Date Placeholder */}
          <div className="flex items-center gap-2">
            {/* Calendar Icon Placeholder */}
            <div className="h-4 w-4 rounded bg-gray-200" />
            {/* Date Text Placeholder */}
            <div className="h-4 w-20 rounded bg-gray-200" />
          </div>

          {/* Avatar Placeholder */}
          <div className="h-8 w-8 rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
