// src/app/(pages)/projects/[projectId]/epics/EpicsLoadingSkeleton.tsx

const EpicsLoadingSkeleton = () => {
  // Array to render 6 skeleton cards (2 columns x 3 rows)
  const skeletonCards = Array(6).fill(null);

  return (
    <div className="w-full min-h-screen bg-slate-50 p-8 space-y-8 animate-pulse">
      {/* Top Navigation & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Breadcrumbs Placeholder */}
        <div className="space-y-2">
          <div className="h-4 w-48 bg-slate-200 rounded"></div>
          <div className="h-10 w-64 bg-slate-200 rounded-lg mt-2"></div>
        </div>

        {/* Top Right Action Buttons Placeholder */}
        <div className="flex gap-3">
          <div className="h-11 w-32 bg-slate-200 rounded-lg"></div>
          <div className="h-11 w-36 bg-slate-200 rounded-lg"></div>
        </div>
      </div>

      {/* Grid Grid Layout for Epic Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {skeletonCards.map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between min-h-[220px]"
          >
            {/* Card Header Section */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4 w-full">
                {/* Profile Circle */}
                <div className="h-12 w-12 bg-slate-200 rounded-full shrink-0"></div>
                {/* Title Line */}
                <div className="h-6 bg-slate-200 rounded w-3/4"></div>
              </div>
              {/* Chevron/Action Icon placeholder */}
              <div className="h-5 w-5 bg-slate-200 rounded-full shrink-0 ml-2"></div>
            </div>

            {/* Middle Metadata Block (Owner, Status, Metrics, etc.) */}
            <div className="my-6 space-y-4">
              {/* Labels Line */}
              <div className="flex gap-4">
                <div className="h-3 w-16 bg-slate-200 rounded"></div>
                <div className="h-3 w-20 bg-slate-200 rounded"></div>
                <div className="h-3 w-24 bg-slate-200 rounded"></div>
              </div>

              {/* Content Detail Placeholders */}
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 bg-slate-200 rounded-full"></div>
                <div className="h-4 w-40 bg-slate-200 rounded"></div>
              </div>
            </div>

            {/* Bottom Progress Bar & Footer Meta */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              {/* Progress Bar Track */}
              <div className="h-2 w-full bg-slate-200 rounded-full"></div>

              {/* Small Footer Tags */}
              <div className="flex justify-between items-center">
                <div className="h-4 w-14 bg-slate-200 rounded"></div>
                <div className="h-4 w-12 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EpicsLoadingSkeleton;
