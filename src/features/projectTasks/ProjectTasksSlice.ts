// // Board/List/Mobile Updates
// // src/features/projectTasks/projectTasksSlice.ts

// import { ProjectTask } from '@/types/shared';
// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// // import { ProjectTask } from '@/features/tasks/tasksSlice';

// interface ProjectTasksState {
//   updates: Record<string, Partial<ProjectTask>>;
// }

// const initialState: ProjectTasksState = {
//   updates: {},
// };

// const projectTasksSlice = createSlice({
//   name: 'projectTasks',

//   initialState,

//   reducers: {
//     // Update any task fields locally after successful PATCH
//     setProjectTaskUpdate(
//       state,
//       action: PayloadAction<
//         Partial<ProjectTask> & {
//           id: string;
//         }
//       >,
//     ) {
//       const task = action.payload;

//       state.updates[task.id] = {
//         ...state.updates[task.id],
//         ...task,
//       };
//     },

//     // Remove cached update for one task
//     clearTaskUpdate(state, action: PayloadAction<string>) {
//       delete state.updates[action.payload];
//     },

//     // Clear all optimistic updates
//     clearAllTaskUpdates(state) {
//       state.updates = {};
//     },
//   },
// });

// export const { setProjectTaskUpdate, clearTaskUpdate, clearAllTaskUpdates } =
//   projectTasksSlice.actions;

// export default projectTasksSlice.reducer;
// src/features/projectTasks/projectTasksSlice.ts

import { ProjectTask } from '@/types/shared';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProjectTasksState {
  updates: Record<string, Partial<ProjectTask>>;
}

const initialState: ProjectTasksState = {
  updates: {},
};

const projectTasksSlice = createSlice({
  name: 'projectTasks',
  initialState,
  reducers: {
    // Update any task fields locally after a successful PATCH (Board / List / Mobile overlay)
    setProjectTaskUpdate(
      state,
      action: PayloadAction<Partial<ProjectTask> & { id: string }>,
    ) {
      const task = action.payload;
      state.updates[task.id] = {
        ...state.updates[task.id], // keep whatever was already cached
        ...task, // merge in the new field(s)
      };
    },

    // Remove cached update for one task
    clearProjectTaskUpdate(state, action: PayloadAction<string>) {
      delete state.updates[action.payload];
    },

    // Clear all optimistic updates
    clearAllProjectTaskUpdates(state) {
      state.updates = {};
    },
  },
});

export const {
  setProjectTaskUpdate,
  clearProjectTaskUpdate,
  clearAllProjectTaskUpdates,
} = projectTasksSlice.actions;

export default projectTasksSlice.reducer;
