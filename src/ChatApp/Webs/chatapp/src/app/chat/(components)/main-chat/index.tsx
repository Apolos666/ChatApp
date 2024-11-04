import { SidebarInset } from "@/components/ui/sidebar";
import { useAppSelector } from "@/store/hooks";
import { ChatHeader } from "./chat-header";
import { PinnedMessage } from "./pinned-message";
import { MessageList } from "./message-list";
import { MessageInput } from "./message-input";
import { NoRoomSelected } from "./no-room-selected";

export const MainChatArea = () => {
  const selectedRoomId = useAppSelector((state) => state.room.selectedRoomId);
  const rooms = useAppSelector((state) => state.room.rooms);
  const selectedRoom = rooms.find((room) => room.id === selectedRoomId);

  if (!selectedRoomId || !selectedRoom) {
    return (
      <SidebarInset>
        <NoRoomSelected />
      </SidebarInset>
    );
  }

  return (
    <SidebarInset>
      <div className="flex flex-col h-svh">
        <ChatHeader />
        <PinnedMessage />
        <MessageList roomId={selectedRoomId} />
        <MessageInput roomId={selectedRoomId} />
      </div>
    </SidebarInset>
  );
};
