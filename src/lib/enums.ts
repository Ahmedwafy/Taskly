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
] as const;

// >>> Tasks View Options
export const TASKS_VIEW_OPTIONS = ['BOARD_VIEW', 'LIST_VIEW'] as const;
