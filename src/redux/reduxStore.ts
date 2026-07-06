// src/redux/reduxStore.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import membersReducer from '../features/members/membersSlice';
import epicsReducer from '@/features/epics/epicsSlice';
import tasksReducer from '@/features/tasks/tasksSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    members: membersReducer,
    epics: epicsReducer,
    tasks: tasksReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
