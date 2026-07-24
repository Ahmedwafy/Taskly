// src → features → tasks → EpicTasksSlice.ts
import { ProjectTask } from '@/types/shared';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

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

    // After Successful PATCH ( Update ) for task details → Update ALL UI State
    updateTaskInStore(state, action) {
      const updatedTask = action.payload;

      const index = state.list.findIndex((task) => task.id === updatedTask.id);

      if (index !== -1) {
        state.list[index] = {
          ...state.list[index],
          ...updatedTask,
        };
      }
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

// export const { clearTasks } = tasksSlice.actions;
export const { clearTasks, updateTaskInStore } = tasksSlice.actions;
export default tasksSlice.reducer;
