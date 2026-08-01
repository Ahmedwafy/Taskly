'use client';
import ProjectCard from '@/app/components/molecules/ProjectCard';
import AddProjectCard from '@/app/components/molecules/AddProjectCard';
import Link from 'next/link';
import ProjectsPageSkeleton from '@/app/(pages)/projects/ProjectsPageSkeleton';
import { ProjectProps } from '@/types/shared';
import { useProjectsInfinite } from '@/app/hooks/projects/useProjectsInfinite';
import { useEffect, useRef } from 'react';

interface Props {
  initialProjects: ProjectProps[];
  initialTotalCount: number;
  limit: number;
}

export default function ProjectsMobile({
  initialProjects,
  initialTotalCount,
  limit,
}: Props) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    error,
  } = useProjectsInfinite({ initialProjects, initialTotalCount, limit });

  const loaderRef = useRef<HTMLDivElement | null>(null);

  const projects = data?.pages.flatMap((page) => page.projects) ?? [];

  useEffect(() => {
    if (!hasNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  return (
    <div className="flex flex-col gap-y-8 py-4 px-2 justify-between w-full mt-15">
      <div className="flex flex-col gap-2">
        <h1 className="title-style">Projects</h1>
        <p className="title-desc-style">Manage and curate your projects</p>
      </div>
      {projects.map((project) => (
        <Link
          href={`/projects/${project.id}/epics`}
          key={project.id}
          className="px-4 py-0 rounded-xl bg-white shadow-sm h-[211.25px]"
        >
          <ProjectCard
            project={project}
            className="flex flex-col justify-between h-full"
          />
        </Link>
      ))}

      <AddProjectCard />

      {isError && (
        <p className="w-full text-center text-red-500 py-4">{error.message}</p>
      )}

      {isFetchingNextPage && <ProjectsPageSkeleton />}

      {hasNextPage && <div ref={loaderRef} className="h-10 w-full" />}
    </div>
  );
}
