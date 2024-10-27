import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserInfo {
  id: string;
  email: string;
  name: string;
    role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  userInfo: UserInfo | null;
  loading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  userInfo: null,
  loading: true,
};

const authSlice = createSlice({
  name: 'auth',
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
    },
  },
});

export const { setAuthenticated, setLoading, logout } = authSlice.actions;
export default authSlice.reducer;
