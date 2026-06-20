// state
// async logic
// reducers

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getProjectMembers } from '@/services/getProjectMembers';

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
  // list: any[];
  list: ProjectMember[];
  loading: boolean;
  error: string | null;
}

const initialState: MembersState = {
  list: [],
  loading: false,
  error: null,
};

// thunk
export const fetchProjectMembers = createAsyncThunk(
  'members/fetchProjectMembers',
  async (projectId: string, { rejectWithValue }) => {
    // console.log('🔥 THUNK CALLED:', projectId);
    try {
      return await getProjectMembers(projectId);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to load members',
      );
    }
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
      })
      .addCase(fetchProjectMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default membersSlice.reducer;
