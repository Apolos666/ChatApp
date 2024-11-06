import { SearchBar } from "./search-bar";
import { RoomCard } from "./room-card";
import { useRooms } from "../../(hooks)/useRooms";
import { RoomCardSkeleton } from "./room-card.skeleton";
import { useState, useMemo } from "react";
import { useAppSelector } from "@/store/hooks";

export const LeftSidebar = () => {
  const { isLoading, error } = useRooms();
  const [searchTerm, setSearchTerm] = useState("");

  const rooms = useAppSelector((state) => state.room.rooms);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) =>
      room.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [rooms, searchTerm]);

  return (
    <div className="sticky top-0 h-svh border-r-3">
      <SearchBar onSearch={setSearchTerm} />
      <div className="overflow-y-auto h-[calc(100vh-80px)] custom-scrollbar p-3 space-y-2">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <RoomCardSkeleton key={index} />
          ))
        ) : error ? (
          <div className="text-center text-red-500 py-4">
            Không thể tải danh sách phòng chat
          </div>
        ) : (
          filteredRooms.map((room) => <RoomCard key={room.id} room={room} />)
        )}
      </div>
    </div>
  );
};
