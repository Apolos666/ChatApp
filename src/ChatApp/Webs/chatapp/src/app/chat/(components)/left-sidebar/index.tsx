import { SearchBar } from "./search-bar";
import { FilterTabs } from "./filter-tabs";
import { RoomCard } from "./room-card";
import { useRooms } from "../../(hooks)/useRooms";
import { RoomCardSkeleton } from "./room-card.skeleton";

export const LeftSidebar = () => {
  const { data: rooms, isLoading, error } = useRooms();

  return (
    <div className="sticky top-0 h-svh border-r-3">
      <SearchBar />
      <FilterTabs />
      <div className="overflow-y-auto h-[calc(100vh-120px)] custom-scrollbar p-3 space-y-2">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <RoomCardSkeleton key={index} />
          ))
        ) : error ? (
          <div className="text-center text-red-500 py-4">
            Không thể tải danh sách phòng chat
          </div>
        ) : (
          rooms?.map((room) => <RoomCard key={room.id} room={room} />)
        )}
      </div>
    </div>
  );
};
