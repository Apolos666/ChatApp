import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { PinnedMessage } from '@/app/chat/(types)/message';

interface PinnedMessageState {
  pinnedMessages: { [roomId: number]: PinnedMessage[] };
  isLoading: boolean;
  error: string | null;
}

const initialState: PinnedMessageState = {
  pinnedMessages: {},
  isLoading: false,
  error: null
};

const pinnedMessageSlice = createSlice({
  name: 'pinnedMessages',
  initialState,
  reducers: {
    setPinnedMessages: (state, action: PayloadAction<{ roomId: number; messages: PinnedMessage[] }>) => {
      const { roomId, messages } = action.payload;
      state.pinnedMessages[roomId] = messages;
    },

    addPinnedMessage: (state, action: PayloadAction<PinnedMessage>) => {
      const { roomId } = action.payload;
      if (!state.pinnedMessages[roomId]) {
        state.pinnedMessages[roomId] = [];
      }
      state.pinnedMessages[roomId].push(action.payload);
    },

    removePinnedMessage: (state, action: PayloadAction<{ roomId: number; messageId: number }>) => {
      const { roomId, messageId } = action.payload;
      if (state.pinnedMessages[roomId]) {
        state.pinnedMessages[roomId] = state.pinnedMessages[roomId]
          .filter(msg => msg.id !== messageId);
      }
    },

    clearPinnedMessages: (state, action: PayloadAction<number>) => {
      const roomId = action.payload;
      delete state.pinnedMessages[roomId];
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  },
});

export const { 
  setPinnedMessages,
  addPinnedMessage,
  removePinnedMessage,
  clearPinnedMessages,
  setLoading,
  setError
} = pinnedMessageSlice.actions;

export default pinnedMessageSlice.reducer;