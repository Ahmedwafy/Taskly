// src > app > components > pages > ProjectsTasks.tsx
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
import TaskDetailsPopUpModal from '../organisms/TaskDetailsPopUpModal';
import InputField from '../atoms/input';
import PLUS from '@/../public/svgIcons/Plus.svg';
import DotsIcon from '@/../public/svgIcons/DotsIcon.svg';
import { ProjectTask } from '@/features/tasks/tasksSlice';
import { formatDate, getInitials, getStatusStyle } from '@/lib/helpers';

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

  // === View & Layout State ===
  const currentValue =
    searchParams.get('view')?.toUpperCase() === 'LIST'
      ? 'LIST_VIEW'
      : 'BOARD_VIEW';

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // ─── STEP 1: DYNAMIC SCREEN DETECTION ──────────────────────────────
  // Prevents mounting and executing mobile fetch loops on desktop screens!
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); // 640px is Tailwind's default 'sm' breakpoint
    };

    handleResize(); // Run on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const handleViewChange = (newValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', newValue.toLowerCase().replace('_view', ''));
    router.push(`${pathname}?${params.toString()}`);
  };

  // === Fetch for List View ===
  const fetchListTasks = useCallback(
    async (page: number, activeSignal: { current: boolean }) => {
      try {
        await Promise.resolve();
        if (!activeSignal.current) return;

        setListLoading(true);
        setListError(null);
        const offset = (page - 1) * LIMIT_LIST;
        const res = await fetch(
          `/api/projects/${projectId}/project-tasks?limit=${LIMIT_LIST}&offset=${offset}`,
        );
        const json = await res.json();

        if (!activeSignal.current) return;
        if (!res.ok) throw new Error(json.error || 'Failed to fetch tasks');

        setListTasks(json.data); // overwrites the previous page's tasks completely.
        setListTotal(json.total);
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

  // ─── STEP 2: RUN ONLY ON LIST VIEW & PREVENT DOUBLE RUNS ──────────
  useEffect(() => {
    const activeSignal = { current: true };

    if (isMobile === false && currentValue === 'LIST_VIEW' && projectId) {
      fetchListTasks(listPage, activeSignal);
    }

    return () => {
      activeSignal.current = false; // Discards outstanding queries on unmount/re-run
    };
  }, [currentValue, projectId, listPage, fetchListTasks, isMobile]);

  // === Fetch & Infinite Scroll for Mobile View ===
  const fetchMobileTasks = useCallback(
    async (currentOffset: number, isInitial = false) => {
      try {
        await Promise.resolve();
        setMobileLoading(true);
        setMobileError(null);

        const res = await fetch(
          `/api/projects/${projectId}/project-tasks?limit=${LIMIT_MOBILE}&offset=${currentOffset}`,
        );
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to fetch tasks');

        setListTotal(json.total);

        setMobileTasks((prev) => {
          const updatedList = isInitial ? json.data : [...prev, ...json.data];
          // ONLY mark hasMore as true if we received a full page and haven't hit the limit
          const hasMoreAvailable =
            updatedList.length < json.total &&
            json.data.length === LIMIT_MOBILE;
          setMobileHasMore(hasMoreAvailable);
          return updatedList;
        });
      } catch (err: unknown) {
        setMobileError(
          err instanceof Error ? err.message : 'An error occurred',
        );
      } finally {
        setMobileLoading(false);
      }
    },
    [projectId],
  );

  // Safe Initial Load: Only triggers once when the project changes
  useEffect(() => {
    if (isMobile !== true || !projectId) return;

    const activeSignal = { current: true };

    const init = async () => {
      await Promise.resolve();
      if (!activeSignal.current) return;

      setMobileTasks([]);
      setMobileOffset(0);
      setMobileHasMore(true); // Default to true so we can fetch the initial page
      fetchMobileTasks(0, true);
    };

    init();

    return () => {
      activeSignal.current = false;
    };
  }, [projectId, isMobile, fetchMobileTasks]);

  // Mobile Intersection Observer Trigger
  useEffect(() => {
    if (isMobile !== true) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const targetEntry = entries[0];

        // CRITICAL SAFEGUARDS:
        // 1. Only run if intersecting, not loading, and we are allowed to fetch more.
        // 2. IMPORTANT: Do not fetch next pages until page 1 (isInitial) has completed!
        //    (This prevents the observer from rapidly calling offset=10, 20 on mount)
        if (
          targetEntry.isIntersecting &&
          mobileHasMore &&
          !mobileLoading &&
          mobileTasks.length > 0
        ) {
          // Double-check if we've reached the absolute database limit
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
    if (!searchQuery.trim()) return mobileTasks;
    return mobileTasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.task_id.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [mobileTasks, searchQuery]);

  // Prevent flash or hydration mismatch while determining user screen size
  if (isMobile === null) return null;

  return (
    <>
      {/* ▲ ▲ ▲ Desktop Layout ▲ ▲ ▲  h-[calc(100vh-100px)] overflow-hidden*/}
      {!isMobile && (
        <section className="relative w-full flex flex-col">
          <PageHeader
            href={`/project/${projectId}/tasks/new`}
            title="Active Workboard"
            description="Curating Project Alphas production pipeline and milestones."
            projectName={projectData.name}
            icon={icons.Plus}
            buttonName="Create Task"
            currentValue={currentValue}
            handleViewChange={handleViewChange}
          />

          {currentValue === 'BOARD_VIEW' ? (
            <div className="mt-6 flex-1 min-h-0 w-full max-w-full overflow-x-auto overflow-y-hidden pb-4">
              <div className="inline-flex gap-6 h-full items-start pr-6">
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
                      onTaskClick={setSelectedTaskId}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            //  Ensure List View also behaves nicely inside this container limit
            <div className="relative pt-6 pb-5 flex-1 min-h-0 overflow-y-auto">
              <TasksListView
                tasks={listTasks}
                loading={listLoading}
                error={listError}
                total={listTotal}
                page={listPage}
                limit={LIMIT_LIST}
                onPageChange={setListPage}
                onTaskClick={setSelectedTaskId}
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

          {selectedTaskId && (
            <TaskDetailsPopUpModal
              taskId={selectedTaskId}
              projectId={projectId}
              onClose={() => setSelectedTaskId(null)}
            />
          )}
        </section>
      )}

      {/* ▲ ▲ ▲ Mobile Layout ▲ ▲ ▲ */}
      {isMobile && (
        <section className="min-h-screen px-4 py-8 relative flex flex-col gap-4">
          <header className="title-style">Active Workboard</header>

          <div className="px-4 flex flex-col gap-4">
            <InputField
              variant="search"
              placeholder="Search Tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Link href={`/projects/${projectId}/tasks/new`} className="w-full">
              <Button name="Create Task" className="w-full">
                <PLUS />
              </Button>
            </Link>
          </div>

          <div className="flex flex-col gap-3 px-0 mt-2">
            {filteredMobileTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => setSelectedTaskId(task.id)}
                className="flex flex-col gap-6 p-4 bg-white rounded-lg shadow-sm cursor-pointer 
                active:scale-95 transition-transform"
              >
                <div className="flex flex-col">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-[#43465480]">
                      {task.task_id}
                    </span>
                    <span
                      className={` ${getStatusStyle(task.status)} p-1 rounded-sm`}
                    >
                      {task.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h4 className="font-medium text-neutral-100 text-[18px] -mt-2">
                    {task.title}
                  </h4>
                </div>

                <div className="flex justify-between w-full gap-2 items-center">
                  <div className="flex gap-2 items-center">
                    {task.assignee.name && (
                      <span className="flex justify-center items-center bg-[#DAE2FF] rounded-xl w-7 h-7 font-bold text-[11px]">
                        {getInitials(task.assignee.name)}
                      </span>
                    )}
                    {formatDate(task.due_date) && (
                      <span className="flex flex-col gap-2">
                        <span className="uppercase font-bold text-[11px] text-[#434654B2] leading-1">
                          due date
                        </span>
                        <span className="text-[12px] leading-4">
                          {formatDate(task.due_date)}
                        </span>
                      </span>
                    )}
                  </div>
                  <p>
                    <DotsIcon />
                  </p>
                </div>
              </div>
            ))}

            {mobileLoading && (
              <p className="text-center text-sm py-4 animate-pulse">
                Loading mobile tasks...
              </p>
            )}
            {mobileError && (
              <p className="text-center text-sm text-red-500 py-4">
                {mobileError}
              </p>
            )}
            {!mobileLoading &&
              !mobileError &&
              filteredMobileTasks.length === 0 && (
                <p className="text-center text-sm italic text-slate-500 py-4">
                  No tasks found
                </p>
              )}

            <div ref={mobileObserverTarget} className="h-4 w-full" />
          </div>
        </section>
      )}
    </>
  );
};

export default ProjectTasks;
