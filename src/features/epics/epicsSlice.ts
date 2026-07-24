// src → features → epics → epicsSlice.ts

// 1 epic details

import { EpicDetails } from '@/types/shared';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FetchEpicDetailsArgs {
  epicId: string;
  projectId: string;
}

interface EpicsState {
  selectedEpic: EpicDetails | null;
  backupEpic: EpicDetails | null; // Keeps a snapshot copy for safe rollback updates
  loading: boolean;
  error: string | null;
}

const initialState: EpicsState = {
  selectedEpic: null,
  backupEpic: null,
  loading: false,
  error: null,
};

export const fetchEpicDetails = createAsyncThunk(
  'epics/fetchEpicDetails',
  async ({ epicId, projectId }: FetchEpicDetailsArgs, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `/api/projects/${projectId}/epics/${epicId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to fetch epic details');
      }

      return data as EpicDetails;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to load epic details',
      );
    }
  },

  {
    // Cache Guard: Prevent refetching if this exact epic is already loaded
    condition: ({ epicId }, { getState }) => {
      const { singleEpic } = getState() as { singleEpic: EpicsState };

      if (singleEpic.loading || singleEpic.selectedEpic?.id === epicId) {
        return false;
      }
    },
  },
);

const epicsSlice = createSlice({
  name: 'epics',
  initialState,
  reducers: {
    clearSelectedEpic(state) {
      state.selectedEpic = null;
      state.backupEpic = null;
      state.error = null;
    },
    // Merges changes instantly to UI and saves original copy inside backupEpic
    updateEpicOptimistically(
      state,
      action: PayloadAction<{
        updatedFields: Partial<EpicDetails> & { assignee_id?: string | null };
      }>,
    ) {
      if (state.selectedEpic) {
        state.backupEpic = { ...state.selectedEpic };
        state.selectedEpic = {
          ...state.selectedEpic,
          ...action.payload.updatedFields,
        };
      }
    },
    // Restores original data structure if server action fails
    rollbackEpicUpdate(state) {
      if (state.backupEpic) {
        state.selectedEpic = state.backupEpic;
        state.backupEpic = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEpicDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEpicDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEpic = action.payload;
        state.backupEpic = null; // Clear old backup steps on new successful fetch
      })
      .addCase(fetchEpicDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearSelectedEpic,
  updateEpicOptimistically,
  rollbackEpicUpdate,
} = epicsSlice.actions;
export default epicsSlice.reducer;
