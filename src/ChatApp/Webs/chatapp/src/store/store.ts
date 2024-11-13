import { configureStore } from '@reduxjs/toolkit';
import messageReducer from './features/messageSlice';
import roomSlice from './features/roomSlice';
import typingSlice from './features/typingSlice';
import pinnedMessageSlice from './features/pinnedMessageSlice';

export const store = configureStore({
  reducer: {
    messages: messageReducer,
    room: roomSlice,
    typing: typingSlice,
    pinnedMessages: pinnedMessageSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 