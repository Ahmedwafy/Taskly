// src > app > components > organisms > TaskColumn.tsx
'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { ProjectTask } from '@/features/tasks/tasksSlice';
import AddTaskIcon from '@/../public/svgIcons/AddTaskIcon.svg';
import AddTaskIcon2 from '@/../public/svgIcons/AddTaskIcon2.svg';
import TaskCard from '../molecules/TaskCard';
import Link from 'next/link';
import { getStatusStyle, getTasksStatusStyle } from '@/lib/helpers';
import TaskCardSkeleton from '../loadingSkeletons/TaskCardSkeleton';

interface TaskColumnProps {
  projectId: string;
  title: string;
  status: string;
  onTaskClick: (taskId: string) => void;
}

const COLUMN_LIMIT = 10;

const TaskColumn = ({
  projectId,
  title,
  status,
  onTaskClick,
}: TaskColumnProps) => {
  // --- Lazy Loading States ---
  const [hasIntersected, setHasIntersected] = useState<boolean>(false);

  // --- Task Pagination States ---
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setMore] = useState<boolean>(true);

  // --- Refs ---
  const columnRef = useRef<HTMLDivElement | null>(null); // To observe horizontal entry
  const observerTarget = useRef<HTMLDivElement | null>(null); // To observe vertical scroll (infinite scroll)

  // 1. HORIZONTAL SCROLL OBSERVER (Lazy load column on scroll)
  useEffect(() => {
    const currentColumn = columnRef.current;
    if (!currentColumn) return;

    const horizontalObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasIntersected(true);
            // Once visible, stop observing this column entirely
            horizontalObserver.unobserve(entry.target);
          }
        });
      },
      {
        // Adjust rootMargin horizontally to load columns slightly before they slide into view (e.g., 200px ahead)
        rootMargin: '0px 200px 0px 200px',
        threshold: 0.01,
      },
    );

    horizontalObserver.observe(currentColumn);

    return () => {
      if (currentColumn) {
        horizontalObserver.unobserve(currentColumn);
      }
    };
  }, []);
  const fetchColumnTasks = useCallback(
    async (currentOffset: number, isInitial = false) => {
      if (!hasIntersected) return;
      if (loading || (!isInitial && !hasMore)) return;

      try {
        await Promise.resolve();
        setLoading(true);
        setError(null);

        const res = await fetch(
          `/api/projects/${projectId}/project-tasks?status=${status}&limit=${COLUMN_LIMIT}&offset=${currentOffset}`,
        );
        const json = await res.json();

        // If we catch a 416 or out-of-range error gracefully, treat it as "no more tasks"
        if (
          res.status === 416 ||
          (res.status === 500 && json.error?.includes('range'))
        ) {
          setMore(false);
          return;
        }

        if (!res.ok) throw new Error(json.error || 'Failed to fetch');

        setTasks((prev) => (isInitial ? json.data : [...prev, ...json.data]));

        // Verify if we have actually loaded all items in the database
        const loadedCount = isInitial
          ? json.data.length
          : tasks.length + json.data.length;
        setMore(loadedCount < json.total && json.data.length === COLUMN_LIMIT);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    },
    [projectId, status, loading, hasMore, hasIntersected, tasks.length],
  );

  // Trigger initial fetch ONLY when the column becomes horizontally visible
  useEffect(() => {
    if (hasIntersected) {
      setTasks([]);
      setOffset(0);
      setMore(true);
      fetchColumnTasks(0, true);
    }
  }, [projectId, status, hasIntersected]);

  // 3. VERTICAL INFINITE SCROLL OBSERVER
  useEffect(() => {
    // Only set up vertical infinite scroll detector if the column has loaded/intersected
    if (!hasIntersected) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          const nextOffset = offset + COLUMN_LIMIT;
          setOffset(nextOffset);
          fetchColumnTasks(nextOffset);
        }
      },
      { threshold: 0.1 },
    );

    const target = observerTarget.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [hasMore, loading, offset, fetchColumnTasks, hasIntersected]);

  // border border-slate-100 sm:border-l-[6px] sm:border-l-emerald-800

  return (
    <div
      ref={columnRef}
      className="p-4 flex flex-col h-full bg-slate-50/50 rounded-xl border border-slate-100 transition-opacity duration-300 min-h-100"
      style={{ opacity: hasIntersected ? 1 : 0.4 }} // Visual feedback showing un-fetched columns are "sleeping"
    >
      {/* Column Header */}
      <div className="flex justify-between items-center mb-4 pb-3">
        <div className="flex items-center gap-2">
          <span
            className={`${getTasksStatusStyle(status)} h-2 w-2 rounded-full`}
          ></span>
          <h3 className="font-semibold text-sm tracking-wide uppercase text-[#64748B]">
            {title}
          </h3>
          <span
            className={`${getTasksStatusStyle(status)} 
            ${status === 'IN_PROGRESS' && 'text-primary bg-[#E0E8FF]!'} 
            ${status === 'BLOCKED' && 'text-[#93000A] bg-[#FFDAD6]'} 
            text-xs px-2 py-0.5 rounded-md font-medium`}
          >
            {hasIntersected ? tasks.length : '—'}
          </span>
        </div>

        <Link href={`/projects/${projectId}/tasks/new?status=${status}`}>
          <button
            className="p-1 rounded-md transition-colors"
            title={`Add task to ${title}`}
          >
            <AddTaskIcon />
          </button>
        </Link>
      </div>

      <Link href={`/projects/${projectId}/tasks/new?status=${status}`}>
        <button className="flex gap-4 border-2 border-dashed border-[#C3C6D64D] w-full rounded-md py-4 mb-4 text-center items-center justify-center text-[#64748B] hover:bg-white transition-colors">
          <span>
            <AddTaskIcon2 />
          </span>
          <span>ADD NEW TASK</span>
        </button>
      </Link>

      {/* Task List container with internal overflow */}
      <div className="flex-1 overflow-y-auto max-h-[65vh] pr-1 flex flex-col gap-3">
        {!hasIntersected ? (
          <div className="flex flex-col items-center justify-center py-10 text-slate-400 text-xs">
            <p className="animate-pulse">Scroll horizontally to load...</p>
          </div>
        ) : (
          <>
            <TaskCard
              loading={loading && tasks.length === 0}
              error={error}
              tasks={tasks}
              onTaskClick={onTaskClick}
            />

            {/* The Infinite Scroll Detector Element */}
            <div ref={observerTarget} className="h-4 w-full shrink-0" />

            {loading && tasks.length > 0 && (
              <p className="text-center text-xs py-2 text-slate-400 animate-pulse">
                <TaskCardSkeleton />
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TaskColumn;
