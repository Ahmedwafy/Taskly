//  src > app > components > pages > ProjectsTasks.tsx
'use client';
import * as icons from '@/../public/icons/icons';
import TasksListView from '../organisms/TasksListView';
import Button from '../atoms/Button';
import Plus from '@/../public/svgIcons/Plus.svg';
import Link from 'next/link';
import PageHeader from '../molecules/PageHeader';
import TaskColumn from '../organisms/TaskColumn';
import { ProjectProps } from '@/types/shared';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import InputField from '../atoms/input';
import { ProjectTask } from '@/features/tasks/tasksSlice';
import { toast } from 'sonner';
import DotsIcon from '@/../public/svgIcons/DotsIcon.svg';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  formatDate,
  getInitials,
  getMobileTasksStatusStyle,
} from '@/lib/helpers';
import { useDebounce } from '@/app/hooks/useDebounce';
import MobileTaskSkeleton from '../loadingSkeletons/MobileTasksSkeleton';
import { useIsMobile } from '@/app/hooks/useIsMobile';

interface ProjectTasksProps {
  projectId: string;
  projectData: ProjectProps;
}

const COLUMNS: { title: string; status: string }[] = [
  { title: 'TO DO', status: 'TO_DO' },
  { title: 'IN PROGRESS', status: 'IN_PROGRESS' },
  { title: 'BLOCKED', status: 'BLOCKED' },
  { title: 'IN REVIEW', status: 'IN_REVIEW' },
  { title: 'READY FOR QA', status: 'READY_FOR_QA' },
  { title: 'REOPENED', status: 'REOPENED' },
  { title: 'READY FOR PRODUCTION', status: 'READY_FOR_PRODUCTION' },
  { title: 'DONE', status: 'DONE' },
];

const LIMIT_LIST = 10;
const LIMIT_MOBILE = 10;

const ProjectTasks = ({ projectId, projectData }: ProjectTasksProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentValue =
    searchParams.get('view') === 'list' ? 'LIST_VIEW' : 'BOARD_VIEW';

  const [activeTask, setActiveTask] = useState<ProjectTask | null>(null);
  // const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  // const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // === custom hooks ===
  const debouncedSearch = useDebounce(searchQuery);
  const isMobile = useIsMobile();

  // === List View State ===
  const [listTasks, setListTasks] = useState<ProjectTask[]>([]);
  const [listLoading, setListLoading] = useState<boolean>(true);
  const [listError, setListError] = useState<string | null>(null);
  const [listPage, setListPage] = useState<number>(1);
  const [listTotal, setListTotal] = useState<number>(0);

  // === Mobile View Infinite Scroll State ===
  const [mobileTasks, setMobileTasks] = useState<ProjectTask[]>([]);
  const [mobileLoading, setMobileLoading] = useState<boolean>(false);
  const [mobileError, setMobileError] = useState<string | null>(null);
  const [mobileOffset, setMobileOffset] = useState<number>(0);
  const [mobileHasMore, setMobileHasMore] = useState<boolean>(true);
  const mobileObserverTarget = useRef<HTMLDivElement | null>(null);
  const fetchingMobileRef = useRef<string | null>(null);

  const handleViewChange = (newValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', newValue.toLowerCase().replace('_view', ''));
    router.push(`${pathname}?${params.toString()}`);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  // ●────────────────────────────────────────● Start List View ●─────────────────────────────────────────────────●
  const fetchListTasks = useCallback(
    async (page: number, activeSignal: { current: boolean }) => {
      try {
        setListLoading(true);
        setListError(null);

        const offset = (page - 1) * LIMIT_LIST;
        const response = await fetch(
          `/api/projects/${projectId}/project-tasks?limit=${LIMIT_LIST}&offset=${offset}`,
        );

        if (!activeSignal.current) return;

        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }

        // const results = await response.json();
        const { data, total } = await response.json();

        setListTasks(data);
        setListTotal(total);
      } catch (err: unknown) {
        if (activeSignal.current) {
          setListError(
            err instanceof Error ? err.message : 'An unknown error occurred',
          );
        }
      } finally {
        if (activeSignal.current) {
          setListLoading(false);
        }
      }
    },
    [projectId],
  );

  useEffect(() => {
    const activeSignal = { current: true };

    if (isMobile === false && currentValue === 'LIST_VIEW' && projectId) {
      fetchListTasks(listPage, activeSignal);
    }

    return () => {
      activeSignal.current = false;
    };
  }, [currentValue, projectId, listPage, fetchListTasks, isMobile]);

  // filtering for Desktop List View
  const filteredListTasks = useMemo(() => {
    if (!debouncedSearch.trim()) return listTasks;
    return listTasks.filter(
      (task) =>
        task.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        task.task_id.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );
  }, [listTasks, debouncedSearch]);
  // ●────────────────────────────────────────● End List View ●───────────────────────────────────────────────────●

  // ●────────────────────────────────────────● Start Mobile View ●───────────────────────────────────────────────●
  const fetchMobileTasks = useCallback(
    async (currentOffset: number, isInitial = false) => {
      const fetchKey = `${projectId}-${currentOffset}`;
      if (fetchingMobileRef.current === fetchKey) return;

      try {
        fetchingMobileRef.current = fetchKey;
        setMobileLoading(true);
        setMobileError(null);

        const response = await fetch(
          `/api/projects/${projectId}/project-tasks?limit=${LIMIT_MOBILE}&offset=${currentOffset}`,
        );
        // const response = await res.json();

        if (!response.ok) throw new Error('Failed to fetch tasks');

        const { data, total } = await response.json();

        setListTotal(total);

        setMobileTasks((prev) => {
          const updatedList = isInitial ? data : [...prev, ...data];
          const hasMoreAvailable =
            updatedList.length < total && data.length === LIMIT_MOBILE;
          setMobileHasMore(hasMoreAvailable);
          return updatedList;
        });
      } catch (err: unknown) {
        setMobileError(
          err instanceof Error ? err.message : 'An error occurred',
        );
      } finally {
        setMobileLoading(false);
        if (fetchingMobileRef.current === fetchKey) {
          fetchingMobileRef.current = null;
        }
      }
    },
    [projectId],
  );

  useEffect(() => {
    if (isMobile !== true || !projectId) return;

    const activeSignal = { current: true };
    const init = async () => {
      await Promise.resolve();
      if (!activeSignal.current) return;

      setMobileTasks([]);
      setMobileOffset(0);
      setMobileHasMore(true);
      fetchMobileTasks(0, true);
    };

    init();

    return () => {
      activeSignal.current = false;
      if (fetchingMobileRef.current) {
        fetchingMobileRef.current = null;
      }
    };
  }, [projectId, isMobile, fetchMobileTasks]);

  useEffect(() => {
    if (isMobile !== true) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const targetEntry = entries[0];
        if (
          targetEntry.isIntersecting &&
          mobileHasMore &&
          !mobileLoading &&
          mobileTasks.length > 0
        ) {
          if (mobileTasks.length >= listTotal) {
            setMobileHasMore(false);
            return;
          }

          const nextOffset = mobileOffset + LIMIT_MOBILE;
          setMobileOffset(nextOffset);
          fetchMobileTasks(nextOffset);
        }
      },
      { threshold: 0.1 },
    );

    const currentTarget = mobileObserverTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [
    mobileHasMore,
    mobileLoading,
    mobileOffset,
    fetchMobileTasks,
    mobileTasks.length,
    listTotal,
    isMobile,
  ]);

  const filteredMobileTasks = useMemo(() => {
    if (!debouncedSearch.trim()) return mobileTasks;
    return mobileTasks.filter(
      (task) =>
        task.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        task.task_id.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );
  }, [mobileTasks, debouncedSearch]);
  // ●────────────────────────────────────────● End Mobile View ●───────────────────────────────────────────────●

  // ●────────────────────────────────────────● Start Drag & Drop ●───────────────────────────────────────────────●
  const handleDragStart = (event: DragStartEvent) => {
    // Grab the data cleanly from the dnd-kit event context
    const taskData = event.active.data.current?.task as ProjectTask | undefined;
    if (taskData) {
      setActiveTask(taskData);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as string;

    // Extract the task object natively
    const activeTaskData = active.data.current?.task as ProjectTask | undefined;
    if (!activeTaskData) return;

    const originalStatus = activeTaskData.status;
    if (originalStatus === newStatus) return;

    // Fire your events using the clean object reference
    const dndEvent = new CustomEvent('dnd-task-status-updated', {
      detail: {
        taskId,
        fromStatus: originalStatus,
        toStatus: newStatus,
        taskData: activeTaskData,
      },
    });
    window.dispatchEvent(dndEvent);

    try {
      const res = await fetch(
        `/api/projects/${projectId}/project-tasks/${activeTaskData.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'API Request Failed');

      toast.success(`Task status updated to ${newStatus.replace(/_/g, ' ')}`);
    } catch (error) {
      const rollbackEvent = new CustomEvent('dnd-task-status-updated', {
        detail: {
          taskId,
          fromStatus: newStatus,
          toStatus: originalStatus,
          taskData: activeTaskData,
        },
      });
      window.dispatchEvent(rollbackEvent);

      toast.error('Failed to change status. Reverting change.');
    }
  };
  // ●────────────────────────────────────────● End Drag & Drop ●───────────────────────────────────────────────●

  if (isMobile === null) return null;

  return (
    <>
      {/* ●──────────────────────────● Desktop View ●──────────────────────────● */}
      {!isMobile && (
        <section className="relative w-full flex flex-col h-screen">
          <PageHeader
            href={`/projects/${projectId}/tasks/new`}
            title="Active Workboard"
            description="Curating Project Alphas production pipeline and milestones."
            projectName={projectData.name}
            icon={icons.Plus}
            buttonName="Create Task"
            currentValue={currentValue}
            handleViewChange={handleViewChange}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          {currentValue === 'BOARD_VIEW' ? (
            <DndContext
              sensors={sensors}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className="mt-6 flex-1 min-h-0 w-full max-w-full overflow-x-auto overflow-y-hidden pb-4 bg-green-200">
                <div className="inline-flex gap-6 h-full items-start pr-6 bg-red-400">
                  {COLUMNS.map((col) => (
                    <div
                      key={col.status}
                      className="w-[320px] shrink-0 flex flex-col"
                      style={{ minWidth: '320px' }}
                    >
                      <TaskColumn
                        projectId={projectId}
                        title={col.title}
                        status={col.status}
                        searchQuery={debouncedSearch}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Clone */}
              <DragOverlay dropAnimation={null}>
                {activeTask ? (
                  <div className="w-[288px] opacity-95 shadow-2xl pointer-events-none transform rotate-2">
                    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg border border-slate-200/80 shadow-md">
                      <div>
                        <span className="text-[#43465480] text-[11px]">
                          {activeTask.task_id}
                        </span>
                        <h2 className="text-slate-900 text-[14px] font-semibold">
                          {activeTask.title}
                        </h2>
                      </div>
                      <div className="flex justify-between items-center text-xs text-slate-500">
                        <span>
                          {activeTask.due_date
                            ? new Date(activeTask.due_date).toLocaleDateString()
                            : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          ) : (
            <div className="relative pt-6 pb-5 flex-1 min-h-0 overflow-y-auto">
              <TasksListView
                tasks={filteredListTasks}
                loading={listLoading}
                error={listError}
                total={listTotal}
                page={listPage}
                limit={LIMIT_LIST}
                onPageChange={setListPage}
                projectId={projectId}
              />

              <Link
                href={`/projects/${projectId}/tasks/new`}
                className="fixed bottom-10 right-10"
              >
                <Button className="px-6 py-6">
                  <Plus />
                </Button>
              </Link>
            </div>
          )}
        </section>
      )}

      {/* ●──────────────────────────● Mobile View ●──────────────────────────● */}
      {isMobile && (
        <section className="min-h-screen py-8 relative flex flex-col gap-4">
          <header className="title-style">Active Workboard</header>
          <div className="flex flex-col gap-4">
            <InputField
              variant="search"
              placeholder="Search Tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Link href={`/projects/${projectId}/tasks/new`} className="w-full">
              <Button name="Create Task" className="w-full">
                <Plus />
              </Button>
            </Link>
          </div>

          <div className="flex flex-col gap-3 px-0 mt-2">
            {filteredMobileTasks.map((task) => (
              <div
                key={task.id}
                onClick={() =>
                  router.push(`/projects/${projectId}/tasks/${task.id}`)
                }
                className="flex flex-col gap-6 p-4 bg-white rounded-lg shadow-sm cursor-pointer 
                active:scale-95 transition-transform"
              >
                <div className="flex justify-between">
                  <div>
                    <span className="text-[#43465480] text-[11px]">
                      {task.task_id}
                    </span>
                    <h2 className="text-neutral-100 text-[18px]">
                      {task.title}
                    </h2>
                  </div>

                  <div
                    className={`${getMobileTasksStatusStyle(task.status)} h-fit p-1 rounded-md text-[11px] font-bold`}
                  >
                    {task.status.replace(/_/g, ' ')}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#DAE2FF] rounded-xl p-1 flex items-center">
                      {task.assignee.name && (
                        <span className="font-bold text-[11px] ">
                          {getInitials(task.assignee.name)}
                        </span>
                      )}
                    </span>
                    <p className="flex flex-col">
                      <span className="text-[#434654B2] text-[11px]">
                        due date
                      </span>
                      <span className="text-neutral-100 text-[12px]">
                        {formatDate(task.due_date, 'US')}
                      </span>
                    </p>
                  </div>
                  <DotsIcon />
                </div>
              </div>
            ))}

            {mobileLoading && <MobileTaskSkeleton />}

            {mobileError && (
              <p className="text-center text-sm py-4 animate-pulse">Error</p>
            )}

            <div ref={mobileObserverTarget} className="h-4 w-full" />
          </div>
        </section>
      )}
    </>
  );
};

export default ProjectTasks;
