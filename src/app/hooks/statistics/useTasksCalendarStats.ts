// app/hooks/statistics/useTasksCalendarStats.ts
import { useQuery } from '@tanstack/react-query';
import { TasksCalendarStatsResponse } from '@/types/statistics';

interface UseTasksCalendarStatsParams {
  startDate: string;
  endDate: string;
  projectId: string | null;
  status: string | null;
}

async function fetchCalendarStats(
  params: UseTasksCalendarStatsParams,
): Promise<TasksCalendarStatsResponse> {
  const response = await fetch('/api/statistics/calendar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || 'Failed to load calendar stats.');
  }

  return data;
}

export function useTasksCalendarStats(params: UseTasksCalendarStatsParams) {
  return useQuery({
    queryKey: ['statistics', 'calendar', params],
    queryFn: () => fetchCalendarStats(params),
  });
}
