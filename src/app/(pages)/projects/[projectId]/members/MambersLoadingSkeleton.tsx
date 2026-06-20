// app/projects/loading.tsx

export default function MambersLoadingSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="h-3 w-12 rounded bg-gray-200" />
            <div className="h-3 w-20 rounded bg-gray-200" />
          </div>

          <div className="h-8 w-52 rounded bg-gray-200" />
          <div className="h-4 w-80 rounded bg-gray-200" />
        </div>

        <div className="h-10 w-32 rounded-lg bg-gray-200" />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        {/* Table Header */}
        <div className="grid grid-cols-4 gap-6 pb-4 border-b border-gray-100">
          <div className="h-4 w-24 rounded bg-gray-200" />
          <div className="h-4 w-24 rounded bg-gray-200" />
          <div className="h-4 w-20 rounded bg-gray-200" />
          <div className="h-4 w-8 rounded bg-gray-200 ml-auto" />
        </div>

        {/* Rows */}
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-4 gap-6 py-6 border-b border-gray-100 last:border-b-0"
          >
            {/* Name */}
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-xl bg-gray-200" />
              <div className="h-4 w-40 rounded bg-gray-200" />
            </div>

            {/* Email */}
            <div className="flex items-center">
              <div className="h-4 w-36 rounded bg-gray-200" />
            </div>

            {/* Status */}
            <div className="flex items-center">
              <div className="h-6 w-16 rounded-full bg-gray-200" />
            </div>

            {/* Action */}
            <div className="flex items-center justify-end">
              <div className="size-5 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
