// src → features → tasks → tasksSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface Assignee {
  id: string;
  name: string;
  email: string;
  department: string;
}

export interface ProjectTask {
  id: string;
  project_id: string;
  epic_id: string;
  title: string;
  description: string;
  assignee: Assignee;
  due_date: string;
  status: string; // e.g., 'todo', 'in_progress', 'done'
  created_at: string;
  // ... Add any other fields you expect from the API response
}

interface TasksState {
  list: ProjectTask[];
  loading: boolean;
  error: string | null;
  fetchedEpicId: string | null; // Tracks precisely WHICH epic's tasks are globally cached
}

const initialState: TasksState = {
  list: [],
  loading: false,
  error: null,
  fetchedEpicId: null,
};

interface FetchEpicTasksArgs {
  projectId: string;
  epicId: string;
}

// Thunk calling the future tasks proxy endpoint
export const fetchEpicTasks = createAsyncThunk(
  'tasks/fetchEpicTasks',
  async ({ projectId, epicId }: FetchEpicTasksArgs, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `/api/projects/${projectId}/epics/${epicId}/tasks`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to fetch epic tasks');
      }

      return { tasks: data as ProjectTask[], epicId };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to load tasks',
      );
    }
  },
  {
    // Cache Guard: Prevent multi-fetching across different components/paths
    condition: ({ epicId }, { getState }) => {
      const { tasks } = getState() as { tasks: TasksState };

      // Skip network request if already loading OR if this epic's tasks are already in Redux
      if (tasks.loading || tasks.fetchedEpicId === epicId) {
        return false;
      }
    },
  },
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearTasks(state) {
      state.list = [];
      state.fetchedEpicId = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEpicTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEpicTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.tasks;
        state.fetchedEpicId = action.payload.epicId; // Seal the cache to this epic
      })
      .addCase(fetchEpicTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; // Saves the error message to state coming from the thunk
      });
  },
});

export const { clearTasks } = tasksSlice.actions;
export default tasksSlice.reducer;
