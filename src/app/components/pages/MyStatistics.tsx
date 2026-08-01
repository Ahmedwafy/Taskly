'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import PageHeader from '@/app/components/molecules/PageHeader';
import Previous from '@/../public/svgIcons/Previous.svg';
import Next from '@/../public/svgIcons/Next.svg';
import { ProjectProps } from '@/types/shared';
import { STATUS_OPTIONS, TaskStatus } from '@/lib/enums';

import TotalTasksIcon from '@/../public/svgIcons/TotalTasksIcon.svg';
import CompletedTasksIcon from '@/../public/svgIcons/CompletedTasksIcon.svg';
import OverDueIcon from '@/../public/svgIcons/OverDueIcon.svg';
import Select from 'react-select';
import { getTaskStatusBadgeStyle } from '@/lib/helpers/status';
import { selectStyles, STATUS_CONFIG } from '@/lib/constants/status';
import { DayPicker, DateRange } from 'react-day-picker';
import 'react-day-picker/style.css'; // base styles — you'll override via classNames below
import { useTasksCalendarStats } from '@/app/hooks/statistics/useTasksCalendarStats';
import { useTasksPerProject } from '@/app/hooks/statistics/useTasksPerProject';
import {
  formatDateShort,
  formatYear,
  formatDateISO,
  isSameDay,
  getStartOfWeek,
  getDaysInRange,
} from '@/lib/helpers/date';

type ProjectOption = {
  value: string;
  label: string;
};

type StatusOption = {
  value: string;
  label: string;
};

// (used only to build the project-filter dropdown options). Everything else — dates, filters, fetched data — lives in local useState.
interface MyStatisticsPageProps {
  projects: ProjectProps[];
}

export default function MyStatisticsPage({ projects }: MyStatisticsPageProps) {
  // --- Filters ---
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [status, setStatus] = useState<string | null>(null);

  console.log(`selectedProjectId`, selectedProjectId);
  console.log(`status`, status);

  // --- Active Date Range --- defaults to the current week via getStartOfWeek()
  const [appliedStart, setAppliedStart] = useState<Date>(() =>
    getStartOfWeek(new Date()),
  );
  const [appliedEnd, setAppliedEnd] = useState<Date>(() => {
    const start = getStartOfWeek(new Date());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return end;
  });

  const dateParams = {
    startDate: formatDateISO(appliedStart),
    endDate: formatDateISO(appliedEnd),
  };

  const {
    data: stats,
    isLoading: isLoadingCalendar,
    error: calendarError,
  } = useTasksCalendarStats({
    ...dateParams,
    projectId: selectedProjectId === 'all' ? null : selectedProjectId,
    status,
  });

  const { data: projectStats = [] } = useTasksPerProject(dateParams);

  const isLoading = isLoadingCalendar;
  const apiError =
    calendarError instanceof Error ? calendarError.message : null;

  // --- Picker Popover State ---
  const [isOpen, setIsOpen] = useState(false);
  const [tempRange, setTempRange] = useState<DateRange | undefined>({
    from: appliedStart,
    to: appliedEnd,
  });
  const [pickerError, setPickerError] = useState<string | null>(null);

  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenPicker = () => {
    setTempRange({ from: appliedStart, to: appliedEnd });
    setPickerError(null);
    setIsOpen(true);
  };

  // shift appliedStart / appliedEnd by ±7 days directly — no popover involved.
  const handleWeekShift = (direction: 'prev' | 'next') => {
    const shift = direction === 'next' ? 7 : -7;
    const newStart = new Date(appliedStart);
    newStart.setDate(appliedStart.getDate() + shift);
    const newEnd = new Date(appliedEnd);
    newEnd.setDate(appliedEnd.getDate() + shift);

    setAppliedStart(newStart);
    setAppliedEnd(newEnd);
  };

  const handleApply = () => {
    if (!tempRange?.from) return;

    const finalStart = tempRange.from;
    const finalEnd = tempRange.to || tempRange.from;

    const diffDays =
      Math.ceil((finalEnd.getTime() - finalStart.getTime()) / 86400000) + 1;

    if (diffDays > MAX_RANGE_DAYS) {
      setPickerError(`Maximum range is ${MAX_RANGE_DAYS} days`);
      return;
    }

    setAppliedStart(finalStart);
    setAppliedEnd(finalEnd);
    setIsOpen(false);
  };

  const MAX_RANGE_DAYS = 7;

  const handleRangeSelect = (range: DateRange | undefined) => {
    setPickerError(null);

    // Cleared selection (e.g. clicking the same day twice)
    if (!range?.from) {
      setTempRange(undefined);
      return;
    }

    // Only the start date is picked so far — always valid, nothing to check yet
    if (!range.to) {
      setTempRange(range);
      return;
    }

    const diffDays =
      Math.ceil(
        (range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24),
      ) + 1;

    if (diffDays > MAX_RANGE_DAYS) {
      setPickerError(`Maximum range is ${MAX_RANGE_DAYS} days`);
      // Restart the selection from the newly clicked date instead of
      // silently truncating — mirrors your original handleDateClick UX
      setTempRange({ from: range.from, to: undefined });
      return;
    }

    setTempRange(range);
  };

  const isDayOutOfRange = (day: Date) => {
    if (!tempRange?.from || tempRange.to) return false;
    const diffDays =
      Math.ceil(
        (day.getTime() - tempRange.from.getTime()) / (1000 * 60 * 60 * 24),
      ) + 1;
    return diffDays > MAX_RANGE_DAYS; // only restricts forward clicks past the cap
  };

  const formattedRangeText = `${formatDateShort(appliedStart)} - ${formatDateShort(appliedEnd)}, ${formatYear(appliedEnd)}`;
  const visibleDays = getDaysInRange(appliedStart, appliedEnd);
  const today = new Date();

  // Fast map lookup for daily stats
  const dailyStatsMap = useMemo(() => {
    if (!stats?.daily) return {};
    return stats.daily.reduce(
      (acc, curr) => {
        acc[curr.day] = curr.statuses;
        return acc;
      },
      {} as Record<string, Record<string, number>>,
    );
  }, [stats]);

  const donutData = useMemo(() => {
    const totals = stats?.totals || {};
    const totalCount =
      stats?.total_tasks ||
      Object.values(totals).reduce((sum, val) => sum + val, 0);

    if (totalCount === 0) {
      return {
        total: 0,
        gradient: 'conic-gradient(#e2e8f0 0deg 360deg)',
        breakdown: [],
      };
    }

    let currentAngle = 0;
    const gradientParts: string[] = [];
    const breakdown: Array<{
      statusKey: string;
      label: string;
      count: number;
      percentage: number;
      color: string;
      bgClass: string;
    }> = [];

    Object.entries(totals).forEach(([key, count]) => {
      if (count <= 0) return;
      const pct = (count / totalCount) * 100;
      const angle = (count / totalCount) * 360;

      // Status bar + Chart Colors
      const cfg = STATUS_CONFIG[key as TaskStatus];
      const color = cfg?.chart?.color ?? '#64748b'; // hex, used in the gradient
      const bgClass = cfg?.statusbar ?? 'bg-slate-500'; // tailwind class, used for the legend dot + bar
      const label =
        key.charAt(0) + key.slice(1).toLowerCase().replace(/_/g, ' ');

      gradientParts.push(
        `${color} ${currentAngle}deg ${currentAngle + angle}deg`,
      );
      currentAngle += angle;

      breakdown.push({
        statusKey: key,
        label,
        count,
        percentage: pct,
        color,
        bgClass,
      });
    });

    return {
      total: totalCount,
      gradient: `conic-gradient(${gradientParts.join(', ')})`,
      breakdown,
    };
  }, [stats]);

  const projectOptions: ProjectOption[] = [
    { value: 'all', label: 'All Projects' },
    ...projects.map((project) => ({
      value: project.id,
      label: project.name,
    })),
  ];

  const statusOptions: StatusOption[] = [
    { value: 'all', label: 'All Statuses' },
    ...STATUS_OPTIONS.map((status) => ({
      value: status, // TO_DO
      label: status.replace(/_/g, ' '), // TO DO
    })),
  ];

  return (
    <div className="px-4 py-6 bg-background space-y-6">
      <PageHeader
        title="Weekly Planner"
        description="Manage your deadlines and track team velocity."
      />

      {/* ● ● Filters Bar ● ● */}
      <div className="relative flex flex-wrap items-center justify-between gap-4 rounded-xl bg-[#F1F3FF] px-5 py-3.5 h-17">
        {/* Date Stepper */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleWeekShift('prev')}
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-600 hover:bg-white/60"
            aria-label="Previous week"
          >
            <Previous />
          </button>

          <button
            onClick={handleOpenPicker}
            className="text-sm font-bold tracking-tight text-[#0f172a] hover:opacity-80 focus:outline-none"
          >
            {formattedRangeText}
          </button>

          <button
            onClick={() => handleWeekShift('next')}
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-600 hover:bg-white/60"
            aria-label="Next week"
          >
            <Next />
          </button>
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-3 w-1/3">
          <div className="relative w-1/2">
            <Select<ProjectOption>
              value={
                projectOptions.find(
                  (option) => option.value === selectedProjectId,
                ) || null
              }
              options={projectOptions}
              onChange={(selected) =>
                setSelectedProjectId(selected?.value || 'all')
              }
              isSearchable={false}
              styles={selectStyles}
            />
          </div>

          <div className="relative w-1/2">
            <Select<StatusOption>
              value={
                statusOptions.find(
                  (option) => option.value === (status ?? 'all'),
                ) || null
              }
              options={statusOptions}
              onChange={(selected) =>
                setStatus(
                  selected?.value === 'all' ? null : selected?.value || null,
                )
              }
              isSearchable={false}
              styles={selectStyles}
            />
          </div>
        </div>

        {/* Popover Calendar */}
        {isOpen && (
          <div
            ref={popoverRef}
            className="absolute left-0 top-14 z-50 rounded-2xl bg-white p-5 shadow-2xl ring-1 ring-black/5"
          >
            <DayPicker
              mode="range"
              selected={tempRange}
              // onSelect={setTempRange}
              onSelect={handleRangeSelect}
              disabled={isDayOutOfRange}
              defaultMonth={appliedStart}
              classNames={{
                months: 'flex flex-col',
                month_caption: 'flex justify-center items-center h-9 mb-2',
                caption_label: 'text-base font-bold text-[#0f172a]',
                nav: 'flex items-center gap-1',
                button_previous:
                  'p-1 text-slate-600 hover:text-slate-900 absolute left-0',
                button_next:
                  'p-1 text-slate-600 hover:text-slate-900 absolute right-0',
                weekdays:
                  'grid grid-cols-7 text-xs font-semibold text-slate-400',
                weekday: 'text-center py-1',
                week: 'grid grid-cols-7',
                day: 'h-9 w-full text-center text-sm font-medium text-slate-700',
                day_button: 'h-9 w-9 rounded-lg hover:bg-slate-100',
                range_start:
                  'bg-[#dbe6fe] text-[#1d4ed8] rounded-l-lg font-bold',
                range_end: 'bg-[#dbe6fe] text-[#1d4ed8] rounded-r-lg font-bold',
                range_middle: 'bg-[#dbe6fe] text-[#1d4ed8]',
                outside: 'text-slate-300',
                // disabled: 'text-slate-200 cursor-not-allowed',
                disabled:
                  'text-slate-200 cursor-not-allowed pointer-events-none',
              }}
            />

            {pickerError && (
              <p className="mt-3 text-center text-xs font-semibold text-red-500">
                {pickerError}
              </p>
            )}

            <div className="mt-4 flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="rounded-lg bg-[#0052cc] px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-[#0043a8]"
              >
                Apply Range
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ● ● KPI Summary Cards ● ● */}
      {apiError && (
        <div className="rounded-lg bg-red-50 p-4 text-sm font-medium text-red-600">
          {apiError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm">
          <div>
            <p className="text-xs font-medium uppercase text-slate-500">
              Total Tasks
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {isLoading ? '...' : (stats?.total_tasks ?? 0)}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-[#0052CC1A]">
            <TotalTasksIcon />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm">
          <div>
            <p className="text-xs font-medium uppercase text-slate-500">
              Completed Tasks
            </p>
            <p className="mt-1 text-2xl font-bold text-emerald-600">
              {isLoading ? '...' : (stats?.done_tasks ?? 0)}
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-[#0068441A]">
            <CompletedTasksIcon />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm">
          <div>
            <p className="text-xs font-medium uppercase text-slate-500">
              Overdue Tasks
            </p>
            <p className="mt-1 text-2xl font-bold text-rose-600">
              {isLoading ? '...' : (stats?.overdue_tasks ?? 0)}
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-[#FFDAD633]">
            <OverDueIcon />
          </div>
        </div>
      </div>

      {/* ● ● Weekly Calendar View ● ● */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-7">
        {visibleDays.map((dayDate) => {
          const isoKey = formatDateISO(dayDate);
          const isToday = isSameDay(dayDate, today);
          const dayStats = dailyStatsMap[isoKey] || {};
          const statusEntries = Object.entries(dayStats).filter(
            ([_, count]) => count > 0,
          );
          const hasTasks = statusEntries.length > 0;

          return (
            <div
              key={isoKey}
              className={`relative flex min-h-80 flex-col justify-between rounded-xl bg-white p-4 transition-all ${
                isToday
                  ? 'ring-2 ring-[#0052cc] shadow-md'
                  : 'border border-slate-100 shadow-sm'
              }`}
            >
              {isToday && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#0052cc] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                  Today
                </div>
              )}

              <div>
                <div className="mt-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {dayDate.toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <p className="text-base font-bold text-slate-900">
                    {dayDate.toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </p>
                </div>

                {hasTasks && (
                  <div className="mt-4 flex flex-col gap-2">
                    {statusEntries.map(([st, count]) => (
                      <div
                        key={st}
                        className={`flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs ${getTaskStatusBadgeStyle(st as TaskStatus)}`}
                      >
                        <span className="font-semibold uppercase tracking-wide">
                          {st.replace('_', ' ')}
                        </span>
                        <span className="font-bold">{count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {!hasTasks && (
                <div className="my-auto flex flex-col items-center justify-center py-6 text-center text-slate-300">
                  <svg
                    className="h-10 w-10 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                      strokeWidth="1.5"
                    />
                    <line x1="16" y1="2" x2="16" y2="6" strokeWidth="1.5" />
                    <line x1="8" y1="2" x2="8" y2="6" strokeWidth="1.5" />
                    <line x1="3" y1="10" x2="21" y2="10" strokeWidth="1.5" />
                    <path
                      d="M9 14l6 6m0-6l-6 6"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="mt-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    No Tasks
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ● ● Bottom Section: Tasks by Status & All Projects ● ● */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Card 1: Tasks by Status */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-[#0f172a]">Tasks by Status</h3>

          <div className="mt-6 flex flex-col items-center justify-between gap-8 sm:flex-row sm:items-center">
            {/* Conic Graph */}
            <div className="relative flex h-48 w-48 shrink-0 items-center justify-center">
              <div
                className="h-full w-full rounded-full transition-all duration-500"
                style={{ background: donutData.gradient }}
              />
              {/* Inner Circle cutout */}
              <div className="absolute flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white shadow-inner">
                <span className="text-3xl font-extrabold text-[#0f172a]">
                  {donutData.total}
                </span>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Total
                </span>
              </div>
            </div>

            {/* Status Breakdown Lines */}
            <div className="flex w-full flex-col gap-4">
              {donutData.breakdown.length === 0 ? (
                <p className="text-sm font-medium text-slate-400">
                  No tasks available in this range.
                </p>
              ) : (
                donutData.breakdown.map((item) => (
                  <div key={item.statusKey} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${item.bgClass}`}
                        />
                        <span>{item.label}</span>
                      </div>
                      <span className="text-slate-900">{item.count}</span>
                    </div>

                    {/* Progress Bar Track */}
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full ${item.bgClass} transition-all duration-300`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Card 2: All Projects List */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-[#0f172a]">All Projects</h3>

          <div className="mt-6 flex flex-col gap-5">
            {projectStats.length === 0 ? (
              <p className="text-sm font-medium text-slate-400">
                No project data available.
              </p>
            ) : (
              projectStats.map((p) => (
                <div
                  key={p.project_id || p.project_name}
                  className="flex items-center justify-between text-sm font-bold text-slate-700"
                >
                  <span className="text-slate-600">{p.project_name}</span>
                  <span className="text-slate-900">{p.tasks_count} Tasks</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
