'use client';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import AddTaskIcon from '@/../public/svgIcons/AddTaskIcon.svg';
import AddTaskIcon2 from '@/../public/svgIcons/AddTaskIcon2.svg';
import TaskCard from '../molecules/TaskCard';
import Link from 'next/link';
import TaskCardSkeleton from '../loadingSkeletons/TaskCardSkeleton';
import { useDroppable } from '@dnd-kit/core';
import { ProjectTask } from '@/types/shared';
import { useAppSelector } from '@/redux/reduxHooks';
import {
  getColumnTasksCounterStatusStyle,
  getTaskStatusDotStyle,
} from '@/lib/helpers/status';
import { TaskStatus } from '@/lib/enums';

interface TaskColumnProps {
  projectId: string;
  title: string;
  status: TaskStatus;
  searchQuery: string;
}

const COLUMN_LIMIT = 10;

const TaskColumn = ({
  projectId,
  title,
  status,
  searchQuery,
}: TaskColumnProps) => {
  const [hasIntersected, setHasIntersected] = useState<boolean>(false);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [initialLoaded, setInitialLoaded] = useState<boolean>(false);

  // Refs for tracking async guard states without triggering re-renders
  const isFetchingRef = useRef<boolean>(false);
  const hasMoreRef = useRef<boolean>(true);

  const columnRef = useRef<HTMLDivElement | null>(null);
  const observerTarget = useRef<HTMLDivElement | null>(null);

  const { setNodeRef: setDroppableNodeRef, isOver } = useDroppable({
    id: status,
  });

  // get last updated task details from redux
  const optimisticUpdates = useAppSelector(
    (state) => state.projectTasks.updates,
  );

  const setMergedRef = useCallback(
    (node: HTMLDivElement | null) => {
      columnRef.current = node;
      setDroppableNodeRef(node);
    },
    [setDroppableNodeRef],
  );

  // Sync ref with state
  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  // Any locally updated fields (status, title, assignee, etc.)
  // override the original task data without requiring a re-fetch. ( Optimistic Update )
  const mergedTasks = useMemo(() => {
    return tasks.map((task) => ({
      ...task,
      ...(optimisticUpdates[task.id] || {}),
    }));
  }, [tasks, optimisticUpdates]);

  // Client-side task filtering based on title or task code
  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return mergedTasks;

    return mergedTasks.filter(
      (task) =>
        task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.task_id?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [mergedTasks, searchQuery]);

  // Sync state when cards move across columns
  useEffect(() => {
    const handleTaskMoved = (e: Event) => {
      const customEvent = e as CustomEvent<{
        taskId: string;
        fromStatus: string;
        toStatus: string;
        taskData?: ProjectTask;
      }>;
      const { taskId, fromStatus, toStatus, taskData } = customEvent.detail;

      if (fromStatus === status && toStatus !== status) {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
      }

      if (toStatus === status && fromStatus !== status) {
        setTasks((prev) => {
          if (prev.some((t) => t.id === taskId)) return prev;
          const updatedTask = taskData
            ? { ...taskData, status }
            : ({
                id: taskId,
                status,
                title: 'Loading...',
              } as unknown as ProjectTask);
          return [updatedTask, ...prev];
        });
      }
    };

    window.addEventListener('dnd-task-status-updated', handleTaskMoved);
    return () =>
      window.removeEventListener('dnd-task-status-updated', handleTaskMoved);
  }, [status]);

  // --- Horizontal Observer Setup ---
  useEffect(() => {
    const currentColumn = columnRef.current;
    if (!currentColumn) return;

    const horizontalObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasIntersected(true);
            horizontalObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 200px 0px 200px', threshold: 0.01 },
    );

    horizontalObserver.observe(currentColumn);
    return () => {
      if (currentColumn) horizontalObserver.unobserve(currentColumn);
    };
  }, []);

  // Stable fetch function guarded with isFetchingRef
  const fetchColumnTasks = useCallback(
    async (currentOffset: number, isInitial = false) => {
      if (isFetchingRef.current || (!isInitial && !hasMoreRef.current)) return;

      try {
        isFetchingRef.current = true;
        setLoading(true);
        setError(null);

        const res = await fetch(
          `/api/projects/${projectId}/project-tasks?status=${status}&limit=${COLUMN_LIMIT}&offset=${currentOffset}`,
        );

        const response = await res.json();

        if (
          response.status === 416 ||
          (response.status === 500 && response.error?.includes('range'))
        ) {
          setHasMore(false);
          hasMoreRef.current = false;
          if (isInitial) setInitialLoaded(true);
          return;
        }

        if (!res.ok) throw new Error(response.error || 'Failed to fetch');

        const incomingData = response.data || [];
        setTasks((prev) =>
          isInitial ? incomingData : [...prev, ...incomingData],
        );

        const loadedCount = currentOffset + incomingData.length;
        const moreAvailable =
          loadedCount < response.total && incomingData.length === COLUMN_LIMIT;

        setHasMore(moreAvailable);
        hasMoreRef.current = moreAvailable;

        if (isInitial) setInitialLoaded(true);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        if (isInitial) setInitialLoaded(true);
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    },
    [projectId, status], // 🟢 Dependencies stay clean and stable!
  );

  // Initial horizontal scroll trigger
  useEffect(() => {
    if (hasIntersected) {
      fetchColumnTasks(0, true);
    }
  }, [hasIntersected, fetchColumnTasks]);

  // Vertical Infinite Scroll Observer
  useEffect(() => {
    if (!hasIntersected || !initialLoaded || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isFetchingRef.current &&
          hasMoreRef.current
        ) {
          setOffset((prevOffset) => {
            const nextOffset = prevOffset + COLUMN_LIMIT;
            fetchColumnTasks(nextOffset);
            return nextOffset;
          });
        }
      },
      { threshold: 0.1 },
    );

    const target = observerTarget.current;
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [hasIntersected, initialLoaded, hasMore, fetchColumnTasks]);

  return (
    <div
      ref={setMergedRef}
      className={`p-4 flex flex-col h-full rounded-xl border transition-all duration-300 ${
        isOver
          ? 'bg-slate-100/90 border-primary/30 border-dashed translate-2'
          : 'bg-slate-50/50 border-slate-100'
      }`}
      style={{ opacity: hasIntersected ? 1 : 0.4 }}
    >
      <div className="flex justify-between items-center pb-3">
        <div className="flex items-center gap-2 justify-center">
          <span
            className={`${getTaskStatusDotStyle(status)} h-2 w-2 rounded-full`}
          ></span>
          <h3 className="font-semibold text-sm tracking-wide uppercase text-[#64748B]">
            {title}
          </h3>

          <span
            className={`${getColumnTasksCounterStatusStyle(status)} font-bold text-[10px] px-1.5 py-1 rounded-sm`}
          >
            {hasIntersected ? filteredTasks.length : '—'}
          </span>
        </div>
        <Link href={`/projects/${projectId}/tasks/new`}>
          <AddTaskIcon />
        </Link>
      </div>

      <Link href={`/projects/${projectId}/tasks/new`}>
        <div
          className="border-2 border-dashed border-[#C3C6D64D] flex justify-center items-center 
        gap-4 h-13 rounded-md text-[#43465499] font-bold mb-6"
        >
          <AddTaskIcon2 />
          <span className="uppercase tracking-wider text-sm">add new task</span>
        </div>
      </Link>

      <div className="flex-1 overflow-y-auto max-h-[65vh] pr-1 flex flex-col gap-3">
        {!hasIntersected ? (
          <div className="flex flex-col items-center justify-center py-10 text-slate-400 text-xs">
            <p className="animate-pulse">Scroll horizontally to load...</p>
          </div>
        ) : (
          <>
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                id={`task-card-${task.id}`}
                data-task={JSON.stringify(task)}
              >
                <TaskCard
                  loading={false}
                  error={error}
                  tasks={[task]}
                  // task={task}
                  projectId={projectId}
                />
              </div>
            ))}

            {hasMore && (
              <div ref={observerTarget} className="h-4 w-full shrink-0" />
            )}
            {loading && <TaskCardSkeleton />}
          </>
        )}
      </div>
    </div>
  );
};

export default TaskColumn;
