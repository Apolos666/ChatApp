import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Room } from '@/app/chat/(types)/room';
import type { MessageDto } from '@/app/chat/(types)/message';

interface RoomState {
  selectedRoomId: number | null;
  rooms: Room[];
}

const initialState: RoomState = {
  selectedRoomId: null,
  rooms: []
};

const roomSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    setSelectedRoom: (state, action: PayloadAction<number | null>) => {
      state.selectedRoomId = action.payload;
      if (action.payload) {
        state.rooms = state.rooms.map(room =>
          room.id === action.payload
            ? { ...room, unreadCount: 0 }
            : room
        );
      }
    },
    setRooms: (state, action: PayloadAction<Room[]>) => {
      state.rooms = action.payload;
    },
    updateLastMessage: (state, action: PayloadAction<MessageDto>) => {
      const message = action.payload;
      const currentUserId = parseInt(localStorage.getItem("chat_user_id") || "0", 10);
      
      state.rooms = state.rooms.map(room =>
        room.id === message.roomId
          ? {
              ...room,
              lastMessage: {
                content: message.content || '',
                senderName: message.senderName,
                createdAt: message.createdAt,
                senderId: message.senderId
              },
              updatedAt: message.createdAt,
              unreadCount: state.selectedRoomId !== room.id && 
                         message.senderId !== currentUserId
                         ? (room.unreadCount || 0) + 1 
                         : room.unreadCount || 0
            }
          : room
      ).sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime());
    }
  }
});

export const { setSelectedRoom, setRooms, updateLastMessage } = roomSlice.actions;
export default roomSlice.reducer;