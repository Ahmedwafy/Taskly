'use client';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import AddTaskIcon from '@/../public/svgIcons/AddTaskIcon.svg';
import AddTaskIcon2 from '@/../public/svgIcons/AddTaskIcon2.svg';
import TaskCard from '../molecules/TaskCard';
import Link from 'next/link';
import TaskCardSkeleton from '../loadingSkeletons/TaskCardSkeleton';
import { useDroppable } from '@dnd-kit/core';
import {
  getColumnTasksCounterStatusStyle,
  getTaskStatusDotStyle,
} from '@/lib/helpers/status';
import { TaskStatus } from '@/lib/enums';
import { useProjectTasksBoard } from '@/app/hooks/tasks/useProjectTasksBoard';

interface TaskColumnProps {
  projectId: string;
  title: string;
  status: TaskStatus;
  searchQuery: string;
}

const TaskColumn = ({
  projectId,
  title,
  status,
  searchQuery,
}: TaskColumnProps) => {
  const [hasIntersected, setHasIntersected] = useState(false);
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

  // Only start fetching once this column has scrolled into view horizontally
  useEffect(() => {
    const currentColumn = columnRef.current;
    if (!currentColumn) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasIntersected(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 200px 0px 200px', threshold: 0.01 },
    );

    observer.observe(currentColumn);
    return () => observer.unobserve(currentColumn);
  }, []);

  const {
    data,
    isLoading: loading,
    error: queryError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProjectTasksBoard(projectId, status, hasIntersected);

  const error = queryError instanceof Error ? queryError.message : null;
  const tasks = useMemo(() => data?.pages.flatMap((p) => p.data) ?? [], [data]);

  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    return tasks.filter(
      (task) =>
        task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.task_id?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [tasks, searchQuery]);

  // Vertical infinite scroll within the column
  useEffect(() => {
    if (!hasIntersected || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    const target = observerTarget.current;
    if (target) observer.observe(target);
    return () => {
      if (target) observer.unobserve(target);
    };
  }, [hasIntersected, hasNextPage, isFetchingNextPage, fetchNextPage]);

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
        <div className="border-2 border-dashed border-[#C3C6D64D] flex justify-center items-center gap-4 h-13 rounded-md text-[#43465499] font-bold mb-6">
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
                  projectId={projectId}
                />
              </div>
            ))}

            {hasNextPage && (
              <div ref={observerTarget} className="h-4 w-full shrink-0" />
            )}
            {(loading || isFetchingNextPage) && <TaskCardSkeleton />}
          </>
        )}
      </div>
    </div>
  );
};

export default TaskColumn;
