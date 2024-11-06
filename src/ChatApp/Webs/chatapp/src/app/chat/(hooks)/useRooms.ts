import { useQuery } from "@tanstack/react-query";
import { useAppDispatch } from "@/store/hooks";
import { setRooms } from "@/store/features/roomSlice";
import type { Room } from "../(types)/room";
import { getLocalStorageItem } from "@/utils/local-storage";
import { PersistedStateKey } from "@/data/persisted-keys";

export function useRooms() {
  const dispatch = useAppDispatch();

  return useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const token = getLocalStorageItem(PersistedStateKey.Token);
      const response = await fetch("http://localhost:5221/api/rooms", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch rooms");
      }

      const rooms: Room[] = await response.json();
      dispatch(setRooms(rooms));
      return rooms;
    },
  });
}