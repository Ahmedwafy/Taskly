// src/redux/reduxStore.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import membersReducer from '../features/members/membersSlice';
import epicsReducer from '@/features/epics/epicsSlice';
import tasksReducer from '@/features/tasks/EpicTasksSlice';
import projectEpicsSlice from '../features/epics/projectEpicsSlice';
import projectTasksReducer from '../features/projectTasks/ProjectTasksSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    members: membersReducer,
    singleEpic: epicsReducer,
    projectEpics: projectEpicsSlice,
    tasks: tasksReducer,
    projectTasks: projectTasksReducer, // Tasks Page: Board / List / Mobile Updates UI Only
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
