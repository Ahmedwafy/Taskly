// src → app → (pages) → projects → ProjectsMobile.tsx
'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import ProjectCard from '@/app/components/molecules/ProjectCard';
import AddProjectCard from '@/app/components/molecules/AddProjectCard';
import Link from 'next/link';
import ProjectsPageSkeleton from '@/app/(pages)/projects/ProjectsPageSkeleton';
import { ProjectProps } from '@/types/shared';
import { loadMoreProjectsAction } from '@/app/actions/projects'; // Import your Action

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
  const [projects, setProjects] = useState(initialProjects);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [offset, setOffset] = useState(limit);

  const [hasMore, setHasMore] = useState(
    initialProjects.length < initialTotalCount,
  );

  const loaderRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      setError('');

      const currentOffset = offset;

      const result = await loadMoreProjectsAction(limit, currentOffset);

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.projects && result.projects.length > 0) {
        setProjects((prev) => [...prev, ...result.projects]);
        setOffset((prev) => prev + limit);
      }

      if (
        currentOffset + limit >= initialTotalCount ||
        !result.projects?.length
      ) {
        setHasMore(false);
      }
    } catch {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [offset, limit, initialTotalCount, loading, hasMore]);

  // Intersection Observer remains completely unchanged
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];

      if (target.isIntersecting) {
        loadMore();
      }
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadMore]);

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

      {error && <p className="w-full text-center text-red-500 py-4">{error}</p>}

      {loading && <ProjectsPageSkeleton />}

      {hasMore && <div ref={loaderRef} className="h-10 w-full" />}
    </div>
  );
}
