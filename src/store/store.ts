import { configureStore } from '@reduxjs/toolkit';
import monitorReducer from './monitorSlice';

export const store = configureStore({
  reducer: {
    monitors: monitorReducer,
    // Add other reducers as needed
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
