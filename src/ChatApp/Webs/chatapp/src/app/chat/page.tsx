import { SidebarProvider } from "@/components/ui/sidebar";
import { LeftSidebar } from "./(components)/left-sidebar";
import { MainChatArea } from "./(components)/main-chat";
import { RightSidebar } from "./(components)/right-sidebar";

export default function ChatInterface() {
  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <LeftSidebar />
      <MainChatArea />
      <RightSidebar />
    </SidebarProvider>
  );
}
