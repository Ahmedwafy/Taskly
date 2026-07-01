// src/features/members/membersSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface ProjectMember {
  member_id: string;
  project_id: string;
  user_id: string;
  role: string;
  email: string;
  metadata: {
    sub: string;
    name: string;
    email: string;
    department?: string;
    email_verified?: boolean;
    phone_verified?: boolean;
  };
}

interface MembersState {
  list: ProjectMember[];
  loading: boolean;
  error: string | null;
  isFetched: boolean;
}

const initialState: MembersState = {
  list: [],
  loading: false,
  error: null,
  isFetched: false,
};

// Updated Thunk calling the API route proxy securely from the client side
export const fetchProjectMembers = createAsyncThunk(
  'members/fetchProjectMembers',
  async (projectId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/members`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to fetch members');
      }

      return data as ProjectMember[];
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to load members',
      );
    }
  },
  {
    condition: (projectId, { getState }) => {
      const { members } = getState() as { members: MembersState };

      // Cache Guard: Check if matching project data is already loaded to avoid extra hits
      const isSameProject =
        members.list.length > 0 && members.list[0].project_id === projectId;

      if (members.loading || (members.isFetched && isSameProject)) {
        return false;
      }
    },
  },
);

const membersSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        state.isFetched = true;
      })
      .addCase(fetchProjectMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default membersSlice.reducer;
