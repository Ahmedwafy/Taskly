import { STATUS_CONFIG } from '../constants/status';

export const getStatusStyle = (status: string) =>
  STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]?.badge ??
  STATUS_CONFIG.DEFAULT.badge;

export const getStatusColors = (status: string) =>
  STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]?.colors ??
  STATUS_CONFIG.DEFAULT.colors;

export const getTasksStatusDOTsStyle = (status: string) =>
  STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]?.dot ??
  STATUS_CONFIG.DEFAULT.dot;

export const getTasksStatusStyle = (status: string) =>
  STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]?.task ??
  STATUS_CONFIG.DEFAULT.task;

export const getMobileTasksStatusStyle = (status: string) =>
  STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]?.mobile ??
  STATUS_CONFIG.DEFAULT.mobile;
