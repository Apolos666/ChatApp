import { useQuery } from "@tanstack/react-query";
import type { Room } from "../(types)/room";

export function useRooms() {
  return useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const token = localStorage.getItem("chat_token");
      const response = await fetch("http://localhost:5221/api/rooms", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch rooms");
      }

      const rooms: Room[] = await response.json();
      return rooms.map(room => ({
        ...room,
        selected: false
      }));
    },
  });
}