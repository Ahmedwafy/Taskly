'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import PageHeader from '@/app/components/molecules/PageHeader';
import Previous from '@/../public/svgIcons/Previous.svg';
import Next from '@/../public/svgIcons/Next.svg';
import ArrowDown from '@/../public/svgIcons/ArrowDown.svg';
import { ProjectProps } from '@/types/shared';
import { STATUS_OPTIONS } from '@/lib/enums';
import {
  TasksCalendarStatsResponse,
  TasksPerProjectItem,
} from '@/types/statistics';
import TotalTasksIcon from '@/../public/svgIcons/TotalTasksIcon.svg';
import CompletedTasksIcon from '@/../public/svgIcons/CompletedTasksIcon.svg';
import OverDueIcon from '@/../public/svgIcons/OverDueIcon.svg';
import Select from 'react-select';
import { StylesConfig } from 'react-select';

type ProjectOption = {
  value: string;
  label: string;
};

type StatusOption = {
  value: string;
  label: string;
};

type SelectOption = {
  value: string;
  label: string;
};
// Helper utilities
const DAYS_OF_WEEK = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];

const formatDateShort = (date: Date) =>
  date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const formatYear = (date: Date) => date.getFullYear();

const formatMonthYear = (date: Date) =>
  date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

const formatDateISO = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const isSameDay = (d1: Date, d2: Date) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

const getStartOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

const getDaysInRange = (startDate: Date, endDate: Date): Date[] => {
  const days: Date[] = [];
  const current = new Date(startDate);
  while (current <= endDate) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
};

const STATUS_PILL_STYLES: Record<string, string> = {
  TO_DO: 'bg-slate-100 text-slate-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700 font-semibold',
  ACTIVE: 'bg-blue-50 text-blue-600',
  DONE: 'bg-emerald-100 text-emerald-700',
  BLOCKED: 'bg-red-50 text-red-600',
};

// Colors matching the screenshot design
const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; borderClass: string; bgClass: string }
> = {
  IN_PROGRESS: {
    label: 'In Progress',
    color: '#0043a8',
    borderClass: 'border-[#0043a8]',
    bgClass: 'bg-[#0043a8]',
  },
  DONE: {
    label: 'Done',
    color: '#005930',
    borderClass: 'border-[#005930]',
    bgClass: 'bg-[#005930]',
  },
  BLOCKED: {
    label: 'Blocked',
    color: '#ba1a1a',
    borderClass: 'border-[#ba1a1a]',
    bgClass: 'bg-[#ba1a1a]',
  },
  TO_DO: {
    label: 'To Do',
    color: '#e2e8f0',
    borderClass: 'border-slate-300',
    bgClass: 'bg-slate-300',
  },
};

interface MyStatisticsPageProps {
  projects: ProjectProps[];
}

export default function MyStatisticsPage({ projects }: MyStatisticsPageProps) {
  // Filters
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [status, setStatus] = useState<string | null>(null);

  // Active Date Range
  const [appliedStart, setAppliedStart] = useState<Date>(() =>
    getStartOfWeek(new Date()),
  );
  const [appliedEnd, setAppliedEnd] = useState<Date>(() => {
    const start = getStartOfWeek(new Date());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return end;
  });

  // API State
  const [stats, setStats] = useState<TasksCalendarStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Picker Popover State
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState<Date>(new Date(appliedStart));
  const [tempStart, setTempStart] = useState<Date | null>(appliedStart);
  const [tempEnd, setTempEnd] = useState<Date | null>(appliedEnd);
  const [pickerError, setPickerError] = useState<string | null>(null);

  const popoverRef = useRef<HTMLDivElement>(null);
  const [projectStats, setProjectStats] = useState<TasksPerProjectItem[]>([]);

  // Execution
  const fetchStatistics = useCallback(async () => {
    setIsLoading(true);
    setApiError(null);

    const payloadDate = {
      startDate: formatDateISO(appliedStart),
      endDate: formatDateISO(appliedEnd),
    };

    try {
      const [calendarResult, projectResult] = await Promise.allSettled([
        fetch('/api/statistics/calendar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...payloadDate,
            projectId: selectedProjectId === 'all' ? null : selectedProjectId,
            status: status,
          }),
        }),
        fetch('/api/statistics/per-project', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payloadDate),
        }),
      ]);

      if (calendarResult.status === 'fulfilled') {
        const calendarRes = calendarResult.value;
        const calendarData = await calendarRes.json();

        if (calendarRes.ok) {
          setStats(calendarData);
        } else {
          setApiError(calendarData.error || 'Failed to load calendar stats.');
        }
      } else {
        setApiError('Network error while loading calendar stats.');
      }

      if (projectResult.status === 'fulfilled') {
        const projectRes = projectResult.value;
        const projectData = await projectRes.json();

        if (projectRes.ok) {
          setProjectStats(projectData);
        } else {
          setProjectStats([]);
        }
      } else {
        setProjectStats([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [appliedStart, appliedEnd, selectedProjectId, status]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

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
    setTempStart(appliedStart);
    setTempEnd(appliedEnd);
    setViewDate(new Date(appliedStart));
    setPickerError(null);
    setIsOpen(true);
  };

  const handleWeekShift = (direction: 'prev' | 'next') => {
    const shift = direction === 'next' ? 7 : -7;
    const newStart = new Date(appliedStart);
    newStart.setDate(appliedStart.getDate() + shift);
    const newEnd = new Date(appliedEnd);
    newEnd.setDate(appliedEnd.getDate() + shift);

    setAppliedStart(newStart);
    setAppliedEnd(newEnd);
  };

  const handleDateClick = (date: Date) => {
    setPickerError(null);

    if (!tempStart || (tempStart && tempEnd)) {
      setTempStart(date);
      setTempEnd(null);
      return;
    }

    if (tempStart && !tempEnd) {
      if (date < tempStart) {
        setTempStart(date);
        setTempEnd(null);
      } else {
        const diffTime = date.getTime() - tempStart.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        if (diffDays > 7) {
          setPickerError('Maximum range is 7 days');
          return;
        }

        setTempEnd(date);
      }
    }
  };

  const isSelected = (date: Date) => {
    if (tempStart && isSameDay(date, tempStart)) return true;
    if (tempEnd && isSameDay(date, tempEnd)) return true;
    if (tempStart && tempEnd && date > tempStart && date < tempEnd) return true;
    return false;
  };

  const handleApply = () => {
    if (!tempStart) return;

    const finalStart = tempStart;
    const finalEnd = tempEnd || tempStart;

    const diffTime = finalEnd.getTime() - finalStart.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    if (diffDays > 7) {
      setPickerError('Maximum range is 7 days');
      return;
    }

    setAppliedStart(finalStart);
    setAppliedEnd(finalEnd);
    setIsOpen(false);
  };

  const renderCalendarDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    let startingDay = firstDayOfMonth.getDay() - 1;
    if (startingDay === -1) startingDay = 6;

    const days = [];
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    for (let i = startingDay - 1; i >= 0; i--) {
      const prevDate = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }

    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }

    const remainingSlots = 42 - days.length;
    for (let i = 1; i <= remainingSlots; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }

    return days;
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

  // Donut chart calculations
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
      const cfg = STATUS_CONFIG[key] || {
        label: key.replace('_', ' '),
        color: '#64748b',
        borderClass: 'border-slate-500',
        bgClass: 'bg-slate-500',
      };

      gradientParts.push(
        `${cfg.color} ${currentAngle}deg ${currentAngle + angle}deg`,
      );
      currentAngle += angle;

      breakdown.push({
        statusKey: key,
        label: cfg.label,
        count,
        percentage: pct,
        color: cfg.color,
        bgClass: cfg.bgClass,
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
      value: status,
      label: status.replace(/_/g, ' '),
    })),
  ];

  const selectStyles: StylesConfig<SelectOption, false> = {
    control: (base) => ({
      ...base,
      border: 'none',
      borderRadius: '8px',
      minHeight: '40px',
      boxShadow: 'none',
      cursor: 'pointer',
      backgroundColor: 'white',
      fontSize: '14px',
      fontWeight: 500,
    }),

    singleValue: (base) => ({
      ...base,
      color: '#0f172a',
      fontWeight: 500,
    }),

    dropdownIndicator: (base) => ({
      ...base,
      padding: '4px',
    }),

    indicatorSeparator: () => ({
      display: 'none',
    }),

    menu: (base) => ({
      ...base,
      borderRadius: '8px',
      overflow: 'hidden',
      zIndex: 50,
    }),

    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? '#F3F4F6'
        : state.isFocused
          ? '#F9FAFB'
          : 'white',
      color: '#1F2937',
      cursor: 'pointer',
      fontWeight: 500,
    }),
  };
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
            {/* <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="h-10 appearance-none rounded-md bg-white pl-4 pr-10 text-sm font-medium text-[#0f172a] shadow-sm outline-none w-full"
            >
              <option value="all">All Projects</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select> */}
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
            {/* <ArrowDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /> */}
          </div>

          <div className="relative w-1/2">
            {/* <select
              value={status ?? 'all'}
              onChange={(e) =>
                setStatus(e.target.value === 'all' ? null : e.target.value)
              }
              className="h-10 appearance-none rounded-md bg-white pl-4 pr-10 text-sm font-medium text-[#0f172a] shadow-sm outline-none w-full"
            >
              <option value="all">All Statuses</option>
              {STATUS_OPTIONS.map((statusOption) => (
                <option key={statusOption} value={statusOption}>
                  {statusOption.replaceAll('_', ' ')}
                </option>
              ))}
            </select> */}
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
            {/* <ArrowDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /> */}
          </div>
        </div>

        {/* Popover Calendar */}
        {isOpen && (
          <div
            ref={popoverRef}
            className="absolute left-0 top-14 z-50 w-85 rounded-2xl bg-white p-5 shadow-2xl ring-1 ring-black/5"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-[#0f172a]">
                {formatMonthYear(viewDate)}
              </h3>
              <div className="flex items-center gap-1 text-slate-600">
                <button
                  onClick={() =>
                    setViewDate(
                      new Date(
                        viewDate.getFullYear(),
                        viewDate.getMonth() - 1,
                        1,
                      ),
                    )
                  }
                  className="p-1 hover:text-slate-900"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 19.5L8.25 12l7.5-7.5"
                    />
                  </svg>
                </button>
                <button
                  onClick={() =>
                    setViewDate(
                      new Date(
                        viewDate.getFullYear(),
                        viewDate.getMonth() + 1,
                        1,
                      ),
                    )
                  }
                  className="p-1 hover:text-slate-900"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="mb-2 grid grid-cols-7 text-center text-xs font-semibold text-slate-400">
              {DAYS_OF_WEEK.map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-1 text-center text-sm">
              {renderCalendarDays().map(({ date, isCurrentMonth }, idx) => {
                const active = isSelected(date);
                const isStart = tempStart && isSameDay(date, tempStart);
                const isEnd = tempEnd && isSameDay(date, tempEnd);

                return (
                  <button
                    key={idx}
                    onClick={() => handleDateClick(date)}
                    className={`h-9 w-full font-medium transition-all ${
                      !isCurrentMonth ? 'text-slate-300' : 'text-slate-700'
                    } ${
                      active
                        ? 'bg-[#dbe6fe] text-[#1d4ed8]'
                        : 'hover:bg-slate-100'
                    } ${isStart ? 'rounded-l-lg font-bold' : ''} ${
                      isEnd ? 'rounded-r-lg font-bold' : ''
                    } ${!tempEnd && isStart ? 'rounded-lg' : ''}`}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>

            {pickerError && (
              <p className="mt-3 text-center text-xs font-semibold text-red-500">
                {pickerError}
              </p>
            )}

            <div className="mt-6 flex items-center justify-end gap-3 pt-2">
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
                        className={`flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs ${
                          STATUS_PILL_STYLES[st] ||
                          'bg-slate-100 text-slate-700'
                        }`}
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
