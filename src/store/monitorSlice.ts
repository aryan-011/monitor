import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store'

interface Monitor {
  id: string;
  name: string;
  fieldsToTrack: string;
  result: string;
  updatedAt: Date;
}

interface MonitorState {
  monitors: Monitor[];
}

const initialState: MonitorState = {
  monitors: [],
};

export const monitorSlice = createSlice({
  name: 'monitors',
  initialState,
  reducers: {
    addMonitor: (state, action: PayloadAction<Monitor>) => {
      state.monitors.push(action.payload);
    },
    deleteMonitor: (state, action: PayloadAction<string>) => {
      state.monitors = state.monitors.filter((monitor) => monitor.id !== action.payload);
    },
    updateMonitor: (state, action: PayloadAction<{ id: string; i:number,monitor:Monitor }>) => {
        const { id, i,monitor } = action.payload;
        if (i !== -1) {
          state.monitors[i] = monitor;
        }
    },
    setMonitors: (state, action: PayloadAction<Monitor[]>) => {
      state.monitors = action.payload;
    },
  },
});

export const { addMonitor, deleteMonitor, setMonitors,updateMonitor } = monitorSlice.actions;

export const selectMonitors = (state: RootState) => state.monitors.monitors;

export default monitorSlice.reducer;
