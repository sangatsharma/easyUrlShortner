import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import linksReducer from './linkSlice';

// Configure the Redux store with the authentication reducer
const store = configureStore({
  reducer: {
    auth: authReducer,
    links: linksReducer,
  },
});

// Infer RootState and AppDispatch from the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;