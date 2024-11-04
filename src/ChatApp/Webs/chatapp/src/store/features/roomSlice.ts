import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Room } from '@/app/chat/(types)/room';

interface RoomState {
  selectedRoomId: number | null;
  rooms: Room[];
}

const initialState: RoomState = {
  selectedRoomId: null,
  rooms: []
};

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setSelectedRoom: (state, action: PayloadAction<number | null>) => {
      state.selectedRoomId = action.payload;
    },
    setRooms: (state, action: PayloadAction<Room[]>) => {
      state.rooms = action.payload;
    }
  }
});

export const { setSelectedRoom, setRooms } = roomSlice.actions;
export default roomSlice.reducer;