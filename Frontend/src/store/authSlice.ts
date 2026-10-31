import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

import { RootState } from "../store/store";

// User information interface
interface UserInfo {
  id: string;
  email: string;
  name: string;
  role: string;
}

// Authentication state interface
interface AuthState {
  isAuthenticated: boolean;
  userInfo: UserInfo | null;
  loading: boolean;
}

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  userInfo: null,
  loading: true,
};

// Thunk to validate token
export const validateToken = createAsyncThunk<
  UserInfo,
  void,
  { rejectValue: string }
>("auth/validateToken", async (_, { rejectWithValue }) => {
  try {
    // Set token to Authorization header
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/user/auth`,
      {
        withCredentials: true,
      }
    );
    return response.data.user; // Assume { id, email, name, role } in the response
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Token validation failed");
  }
});

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<UserInfo | null>) => {
      state.isAuthenticated = !!action.payload;
      state.userInfo = action.payload;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userInfo = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(validateToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        validateToken.fulfilled,
        (state, action: PayloadAction<UserInfo>) => {
          state.isAuthenticated = true;
          state.userInfo = action.payload;
          state.loading = false;
        }
      )
      .addCase(validateToken.rejected, (state) => {
        state.isAuthenticated = false;
        state.userInfo = null;
        state.loading = false;
      });
  },
});

// Export actions and reducer
export const { setAuthenticated, setLoading, logout } = authSlice.actions;
export default authSlice.reducer;
// Selector to get authentication state
export const selectAuth = (state: RootState) => state.auth;
