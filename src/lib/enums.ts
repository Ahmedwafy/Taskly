// src → lib → enums.ts

// >>> Task Status Options
export const STATUS_OPTIONS = [
  'TO_DO',
  'IN_PROGRESS',
  'BLOCKED',
  'IN_REVIEW',
  'READY_FOR_QA',
  'REOPENED',
  'READY_FOR_PRODUCTION',
  'DONE',
  'COMPLETED',
] as const;

export type TaskStatus = (typeof STATUS_OPTIONS)[number];
// type TaskStatus =
//   | 'TO_DO'
//   | 'IN_PROGRESS'
//   | 'BLOCKED'
//   | 'IN_REVIEW'
//   | 'READY_FOR_QA'
//   | 'REOPENED'
//   | 'READY_FOR_PRODUCTION'
//   | 'DONE'
//   | 'COMPLETED';

// >>> Tasks View Options
export const TASKS_VIEW_OPTIONS = ['BOARD_VIEW', 'LIST_VIEW'] as const;
