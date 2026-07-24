import { GetProjectEpicsParams, ProjectEpic } from '@/types/shared';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// interface EpicsState {
//   projectEpics: ProjectEpic[];
//   loading: boolean;
//   error: string | null;
//   isFetched: boolean;
//   projectId: string | null;
// }

interface EpicsState {
  projectEpics: ProjectEpic[];
  totalCount: number;
  loading: boolean;
  error: string | null;
  // Active search & pagination parameters tracked in state
  params: {
    projectId: string;
    limit: number;
    offset: number;
    searchTerm: string;
  };
}

const initialState: EpicsState = {
  projectEpics: [],
  totalCount: 0,
  loading: false,
  error: null,
  params: {
    projectId: '',
    limit: 10,
    offset: 0,
    searchTerm: '',
  },
};

export const getProjectEpics = createAsyncThunk(
  'projectEpics/getProjectEpics',
  async (
    { projectId, limit, offset, searchTerm = '' }: GetProjectEpicsParams,
    { rejectWithValue },
  ) => {
    try {
      const params = new URLSearchParams({
        limit: String(limit),
        offset: String(offset),
        searchTerm, // guaranteed to be a real string now
      });

      const response = await fetch(
        `/api/projects/${projectId}/epics?${params}`,
      );
      // const response = await fetch(
      //   `/api/projects/${projectId}/epics?limit=${limit}&offset=${offset}&searchTerm=${searchTerm}`,
      // );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch epics',
      );
    }
  },
  {
    condition: ({ projectId, limit, offset, searchTerm }, { getState }) => {
      const { projectEpics } = getState() as {
        projectEpics: EpicsState;
      };

      const sameRequest =
        projectEpics.params.projectId === projectId &&
        projectEpics.params.limit === limit &&
        projectEpics.params.offset === offset &&
        projectEpics.params.searchTerm === (searchTerm ?? '');

      return !(
        projectEpics.loading ||
        (sameRequest && projectEpics.projectEpics.length > 0)
      );
    },
  },
);

const projectEpicsSlice = createSlice({
  name: 'projectEpics',
  initialState,
  reducers: {
    setSearchTerm(state, action: PayloadAction<string>) {
      state.params.searchTerm = action.payload;
      state.params.offset = 0; // Reset pagination back to page 1 on search
    },
    setPage(state, action: PayloadAction<number>) {
      // Expects page index (0, 1, 2...)
      state.params.offset = action.payload * state.params.limit;
    },
    clearEpics(state) {
      state.projectEpics = [];
      state.totalCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProjectEpics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProjectEpics.fulfilled, (state, action) => {
        state.loading = false;

        state.projectEpics = action.payload.projectEpics;
        state.totalCount = action.payload.totalCount;

        state.params = {
          projectId: action.meta.arg.projectId,
          limit: action.meta.arg.limit,
          offset: action.meta.arg.offset,
          searchTerm: action.meta.arg.searchTerm ?? '',
        };
        // state.loading = false;
        // state.projectEpics = action.payload.projectEpics;
        // state.totalCount = action.payload.totalCount;
      })
      .addCase(getProjectEpics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSearchTerm, setPage, clearEpics } = projectEpicsSlice.actions;
export default projectEpicsSlice.reducer;
