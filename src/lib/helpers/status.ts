// src > lib > helpers > status.ts

import { STATUS_CONFIG } from '../constants/status';
import { TaskStatus } from '../enums';

export const getTaskStatusBadgeStyle = (status: TaskStatus) =>
  STATUS_CONFIG[status].badge;

export const getStatusColorsStyle = (status: TaskStatus) =>
  STATUS_CONFIG[status].colors;

export const getTaskStatusDotStyle = (status: TaskStatus) =>
  STATUS_CONFIG[status].dot;

export const getColumnTasksCounterStatusStyle = (status: TaskStatus) =>
  STATUS_CONFIG[status].task;

export const getTaskStatusMobileStyle = (status: TaskStatus) =>
  STATUS_CONFIG[status].mobile;
