// src → features → auth → authSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SignInPayload, UserData } from '@/types/auth';
import { signInAction } from '@/app/actions/auth';

interface AuthState {
  user: UserData | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  loading: false,
  error: null,
};

// After User Login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (payload: SignInPayload, { rejectWithValue }) => {
    try {
      const data = await signInAction(payload);

      // 1. catch the error object returned by the Server Action
      if (data.error) {
        return rejectWithValue(data.error);
      }

      // 2. If no error, pass the clean user data to .fulfilled
      return data.user;
    } catch (error) {
      // Handles rare global network drops/crashes
      return rejectWithValue(
        error instanceof Error ? error.message : 'Login failed',
      );
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserData | null>) {
      state.user = action.payload;
      state.isLoggedIn = !!action.payload;
      state.error = null;
    },
    updateUser(state, action: PayloadAction<Partial<UserData>>) {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
      }
    },
    clearUser(state) {
      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isLoggedIn = !!action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        // Read the value intercepted by rejectWithValue
        state.error = (action.payload as string) ?? 'Unable to sign in';
      });
  },
});

export const { setUser, updateUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
