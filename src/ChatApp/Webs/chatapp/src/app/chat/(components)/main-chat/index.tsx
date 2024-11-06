import { SidebarInset } from "@/components/ui/sidebar";
import { useAppSelector } from "@/store/hooks";
import { ChatHeader } from "./chat-header";
import { PinnedMessage } from "./pinned-message";
import { MessageList } from "./message-list";
import { MessageInput } from "./message-input";
import { NoRoomSelected } from "./no-room-selected";
import { useTypingIndicator } from "../../(hooks)/useTypingIndicator";
import { TypingIndicator } from "../utils/typing-indicator";

export const MainChatArea = () => {
  const selectedRoomId = useAppSelector((state) => state.room.selectedRoomId);
  const rooms = useAppSelector((state) => state.room.rooms);
  const selectedRoom = rooms.find((room) => room.id === selectedRoomId);
  const { typingUsers } = useTypingIndicator(selectedRoomId || 0);

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
        <TypingIndicator typingUsers={typingUsers} />
        <MessageInput roomId={selectedRoomId} />
      </div>
    </SidebarInset>
  );
};
