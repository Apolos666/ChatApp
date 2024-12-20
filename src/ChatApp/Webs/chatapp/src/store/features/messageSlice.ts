import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { MessageDto, MessageStatus } from '@/app/chat/(types)/message';

interface MessageState {
  messages: MessageDto[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MessageState = {
  messages: [],
  isLoading: false,
  error: null,
};

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<MessageDto>) => {
      const existingMessage = state.messages.find(m => m.id === action.payload.id);
      const tempMessage = state.messages.find(
        m => 
          m.status === "Sending" && 
          m.content === action.payload.content && 
          m.senderId === action.payload.senderId
      );

      if (existingMessage) {
        // Cập nhật message nếu đã tồn tại
        state.messages = state.messages.map(m => 
          m.id === action.payload.id 
            ? {
                ...action.payload,
                status: ["Sent", "Delivered", "Seen"].includes(m.status)
                  ? m.status
                  : action.payload.status,
              }
            : m
        );
      } else if (tempMessage) {
        // Cập nhật temp message thành message thật
        state.messages = state.messages.map(m =>
          m.id === tempMessage.id
            ? { ...action.payload, status: "Sent" as MessageStatus }
            : m
        );
      } else {
        // Thêm message mới
        state.messages.push(action.payload);
      }
    },
    updateMessageStatus: (
      state,
      action: PayloadAction<{ messageId: number; status: MessageStatus }>
    ) => {
      const { messageId, status } = action.payload;
      state.messages = state.messages.map(msg =>
        msg.id === messageId ? { ...msg, status } : msg
      );
    },
    updateTempMessage: (
      state,
      action: PayloadAction<{ tempId: number; realId: number }>
    ) => {
      const { tempId, realId } = action.payload;
      state.messages = state.messages.map(msg =>
        msg.id === tempId
          ? { ...msg, id: realId, status: "Sent" as MessageStatus }
          : msg
      );
    },
    setMessageFailed: (state, action: PayloadAction<number>) => {
      state.messages = state.messages.map(msg =>
        msg.id === action.payload
          ? { ...msg, status: "Failed" as MessageStatus }
          : msg
      );
    },
    deleteMessage: (state, action: PayloadAction<{
      messageId: number;
    }>) => {
      // Tìm message trong state
      const messageIndex = state.messages.findIndex(
        msg => msg.id === action.payload.messageId
      );
      
      if (messageIndex !== -1) {
        // Cập nhật trạng thái đã xóa
        state.messages[messageIndex] = {
          ...state.messages[messageIndex],
          isDeleted: true,
          content: null // Xóa nội dung tin nhắn
        };
      }
    },
  },
});

export const {
  addMessage,
  updateMessageStatus,
  updateTempMessage,
  setMessageFailed,
  deleteMessage,
} = messageSlice.actions;

export default messageSlice.reducer; 