// src/app/(pages)/projects/ProjectsMobile.tsx
'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import ProjectCard from '@/app/components/molecules/ProjectCard';
import AddProjectCard from '@/app/components/molecules/AddProjectCard';
import Link from 'next/link';
import { Project } from '@/types/project';
import { ProjectCardSkeleton } from '@/app/(pages)/projects/loading';

interface Props {
  initialProjects: Project[];
  initialTotalCount: number;
  limit: number;
}

// TODO ::: If will use this logic many times → Create Custom Hook
const fetchProjects = async (limit: number, offset: number) => {
  const res = await fetch(
    `/api/get-all-projects?limit=${limit}&offset=${offset}`,
  );

  if (!res.ok) {
    throw new Error('Failed to fetch projects');
  }

  return res.json();
};

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

  // load more projects on scroll
  const loadMore = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const currentOffset = offset;

      const data = await fetchProjects(limit, currentOffset);

      setProjects((prev) => [...prev, ...data.projects]);

      setOffset((prev) => prev + limit);

      if (currentOffset + limit >= initialTotalCount) {
        setHasMore(false);
      }
    } catch {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [offset, limit, initialTotalCount]);

  // Intersection Observer
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];

      if (target.isIntersecting && !loading) {
        loadMore();
      }
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadMore, loading]);

  return (
    <section className="flex flex-col gap-y-8 py-4 px-6 justify-between w-full mt-15">
      {projects.map((project) => (
        <Link
          href={`/projects/${project.id}/epics`}
          key={project.id}
          className="bg-surface-low p-4 rounded-xl"
        >
          <ProjectCard project={project} />
        </Link>
      ))}

      <AddProjectCard />
      {/* {hasMore ? null : <AddProjectCard />} */}

      {error && <p className="w-full text-center text-red-500 py-4">{error}</p>}

      {/* {loading && <p className="w-full text-center py-4">Loading...</p>} */}
      {loading && <ProjectCardSkeleton />}

      {hasMore && <div ref={loaderRef} className="h-10 w-full" />}
    </section>
  );
}
