import { configureStore } from '@reduxjs/toolkit';
import messageReducer from './features/messageSlice';

export const store = configureStore({
  reducer: {
    messages: messageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 