// src > types > statistics.ts

export interface GetTasksCalendarStatsParams {
  startDate: string;
  endDate: string;
  projectId?: string | null;
  status?: string | null;
}

export interface TasksCalendarStatsResponse {
  daily: {
    day: string;
    statuses: Record<string, number>;
  }[];

  totals: Record<string, number>;

  total_tasks: number;
  done_tasks: number;
  overdue_tasks: number;
}

// ---------------------------------------------------

export interface TasksPerProjectItem {
  project_id: string;
  project_name: string;
  tasks_count: number;
}

export interface GetTasksPerProjectParams {
  startDate: string;
  endDate: string;
}
