import { SidebarInset } from "@/components/ui/sidebar";
import { ChatHeader } from "./chat-header";
import { PinnedMessage } from "./pinned-message";
import { MessageList } from "./message-list";
import { MessageInput } from "./message-input";

export const MainChatArea = () => {
  return (
    <SidebarInset>
      <div className="flex flex-col h-svh">
        <ChatHeader />
        <PinnedMessage />
        <MessageList />
        <MessageInput />
      </div>
    </SidebarInset>
  );
};
