// src > app > component > organisms > TaskColumn.tsx
'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { ProjectTask } from '@/features/tasks/tasksSlice';
import AddTaskIcon from '@/../public/svgIcons/AddTaskIcon.svg';
import AddTaskIcon2 from '@/../public/svgIcons/AddTaskIcon2.svg';
import TaskCard from '../molecules/TaskCard';
import Link from 'next/link';
import { getTasksStatusDOTsStyle, getTasksStatusStyle } from '@/lib/helpers';
import TaskCardSkeleton from '../loadingSkeletons/TaskCardSkeleton';
import { useDroppable } from '@dnd-kit/core';

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
  const [hasIntersected, setHasIntersected] = useState<boolean>(false);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setMore] = useState<boolean>(true);

  const columnRef = useRef<HTMLDivElement | null>(null);
  const observerTarget = useRef<HTMLDivElement | null>(null);

  const { setNodeRef: setDroppableNodeRef, isOver } = useDroppable({
    id: status,
  });

  const setMergedRef = useCallback(
    (node: HTMLDivElement | null) => {
      columnRef.current = node;
      setDroppableNodeRef(node);
    },
    [setDroppableNodeRef],
  );

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

  // Horizontal Observer Setup
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

  const fetchColumnTasks = useCallback(
    async (currentOffset: number, isInitial = false) => {
      if (loading || (!isInitial && !hasMore)) return;

      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `/api/projects/${projectId}/project-tasks?status=${status}&limit=${COLUMN_LIMIT}&offset=${currentOffset}`,
        );
        const json = await res.json();

        if (
          res.status === 416 ||
          (res.status === 500 && json.error?.includes('range'))
        ) {
          setMore(false);
          return;
        }

        if (!res.ok) throw new Error(json.error || 'Failed to fetch');

        setTasks((prev) => (isInitial ? json.data : [...prev, ...json.data]));
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
    [projectId, status, loading, hasMore, tasks.length],
  );

  // Run initial call ONLY once when column is horizontally scrolled into view
  useEffect(() => {
    if (hasIntersected) {
      fetchColumnTasks(0, true);
    }
  }, [hasIntersected]);

  // Vertical Infinite Scroll Setup
  useEffect(() => {
    if (!hasIntersected || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const nextOffset = offset + COLUMN_LIMIT;
          setOffset(nextOffset);
          fetchColumnTasks(nextOffset);
        }
      },
      { threshold: 0.1 },
    );

    const target = observerTarget.current;
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [hasMore, loading, offset, fetchColumnTasks, hasIntersected]);

  return (
    <div
      ref={setMergedRef}
      className={`p-4 flex flex-col h-full rounded-xl border transition-all duration-300 min-h-125 ${
        isOver
          ? 'bg-slate-100/90 border-primary/30 border-dashed scale-[1.01]'
          : 'bg-slate-50/50 border-slate-100'
      }`}
      style={{ opacity: hasIntersected ? 1 : 0.4 }}
    >
      <div className="flex justify-between items-center pb-3">
        <div className="flex items-center gap-2 justify-center">
          <span
            className={`${getTasksStatusDOTsStyle(status)} h-2 w-2 rounded-full`}
          ></span>
          <h3 className="font-semibold text-sm tracking-wide uppercase text-[#64748B]">
            {title}
          </h3>

          <span
            className={`${getTasksStatusStyle(status)} font-bold text-[10px] px-1.5 py-1 rounded-sm`}
          >
            {hasIntersected ? tasks.length : '—'}
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
            {/* Inject data-task into the card elements wrapper so parent handleDragStart can parse details for overlay */}
            {tasks.map((task) => (
              <div
                key={task.id}
                id={`task-card-${task.id}`}
                data-task={JSON.stringify(task)}
              >
                <TaskCard
                  loading={false}
                  error={error}
                  tasks={[task]}
                  onTaskClick={onTaskClick}
                />
              </div>
            ))}
            <div ref={observerTarget} className="h-4 w-full shrink-0" />
            {loading && <TaskCardSkeleton />}
          </>
        )}
      </div>
    </div>
  );
};

export default TaskColumn;
