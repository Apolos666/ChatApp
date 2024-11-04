import { configureStore } from '@reduxjs/toolkit';
import messageReducer from './features/messageSlice';
import roomSlice from './features/roomSlice';

export const store = configureStore({
  reducer: {
    messages: messageReducer,
    room: roomSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 