import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TypingIndicator } from '@/app/chat/(types)/typing';

interface TypingState {
  typingUsers: { [roomId: number]: TypingIndicator[] };
}

const initialState: TypingState = {
  typingUsers: {},
};

const typingSlice = createSlice({
  name: 'typing',
  initialState,
  reducers: {
    setTypingIndicator: (state, action: PayloadAction<TypingIndicator>) => {
      const { roomId, userId, isTyping } = action.payload;
      
      if (!state.typingUsers[roomId]) {
        state.typingUsers[roomId] = [];
      }

      if (isTyping) {
        // Thêm hoặc cập nhật người đang typing
        const existingIndex = state.typingUsers[roomId].findIndex(
          user => user.userId === userId
        );
        
        if (existingIndex >= 0) {
          state.typingUsers[roomId][existingIndex] = action.payload;
        } else {
          state.typingUsers[roomId].push(action.payload);
        }
      } else {
        // Xóa người không còn typing
        state.typingUsers[roomId] = state.typingUsers[roomId].filter(
          user => user.userId !== userId
        );
      }
    },
    clearTypingIndicators: (state, action: PayloadAction<number>) => {
      delete state.typingUsers[action.payload];
    },
  },
});

export const { setTypingIndicator, clearTypingIndicators } = typingSlice.actions;
export default typingSlice.reducer;