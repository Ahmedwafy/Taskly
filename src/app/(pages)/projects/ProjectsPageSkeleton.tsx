// src/app/(pages)/projects/loading.tsx
// Shown by Next.js automatically while page.tsx is fetching

export const ProjectCardSkeleton = () => (
  <div className="border border-gray-100 py-4 px-8 rounded-lg shadow-sm shadow-black/5 h-80 flex flex-col justify-between w-full md:min-w-112.5 mx-auto bg-white animate-pulse">
    {/* Top: title + description */}
    <div className="flex flex-col gap-y-4 pt-4">
      {/* Title bar */}
      <div className="h-6 w-3/5 rounded-md bg-gray-200" />
      {/* Description lines */}
      <div className="flex flex-col gap-2">
        <div className="h-4 w-full rounded-md bg-gray-100" />
        <div className="h-4 w-4/5 rounded-md bg-gray-100" />
        <div className="h-4 w-2/3 rounded-md bg-gray-100" />
      </div>
    </div>

    {/* Bottom: CREATED AT row */}
    <div className="flex justify-between w-full border-t border-gray-200 pt-4">
      <div className="h-4 w-24 rounded-md bg-gray-200" />
      <div className="h-4 w-20 rounded-md bg-gray-200" />
    </div>
  </div>
);

export default function ProjectsPageSkeleton() {
  return (
    <main className="flex flex-col p-4 bg-background min-h-screen">
      {/* Page header skeleton */}
      <section className="flex justify-between w-full">
        <header className="w-full h-fit pt-6 pl-4 flex flex-col gap-2">
          <div className="h-8 w-32 rounded-md bg-gray-200 animate-pulse" />
          <div className="h-4 w-56 rounded-md bg-gray-100 animate-pulse" />
        </header>
        <div className="hidden lg:flex items-end pb-2 pr-8">
          <div className="h-12 w-48 rounded-md bg-gray-200 animate-pulse" />
        </div>
      </section>

      {/* Cards skeleton grid */}
      <section className="flex flex-wrap gap-y-8 py-4 px-6 justify-between w-full mt-4 gap-8!">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-full md:w-auto">
            <ProjectCardSkeleton />
          </div>
        ))}
        {/* AddProject placeholder */}
        <div className="w-full md:w-auto">
          <div className="border-2 border-dashed border-gray-200 py-4 px-8 rounded-lg h-80 flex flex-col items-center justify-center w-full md:min-w-112.5 mx-auto bg-white animate-pulse gap-4">
            <div className="w-14 h-14 rounded-xl bg-gray-200" />
            <div className="h-5 w-32 rounded-md bg-gray-200" />
          </div>
        </div>
      </section>

      {/* Pagination footer skeleton */}
      <footer className="mt-12 mb-6 px-8 py-4 border-t border-gray-200 flex justify-between items-center">
        <div className="h-4 w-48 rounded-md bg-gray-200 animate-pulse" />
        <div className="flex gap-1.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-9 rounded-md bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      </footer>
    </main>
  );
}
