"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { LeftSidebar } from "./(components)/left-sidebar";
import { MainChatArea } from "./(components)/main-chat";
import { RightSidebar } from "./(components)/right-sidebar";
import { useRooms } from "./(hooks)/useRooms";
import { useSignalR } from "./(hooks)/useSignalR";
import { Loader2 } from "lucide-react";

export default function ChatInterface() {
  const router = useRouter();
  const { data: rooms, isLoading: isRoomsLoading } = useRooms();

  const roomIds = useMemo(() => {
    if (isRoomsLoading || !rooms) return [];
    return rooms.map((room) => room.id);
  }, [isRoomsLoading, rooms]);

  const isSignalRConnected = useSignalR(roomIds);

  useEffect(() => {
    const token = localStorage.getItem("chat_token");
    const userId = localStorage.getItem("chat_user_id");

    if (!token || !userId) {
      router.push("/");
    }
  }, [router]);

  if (isRoomsLoading || !isSignalRConnected) {
    return (
      <div className="h-svh flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p>Đang kết nối...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <LeftSidebar />
      <MainChatArea />
      <RightSidebar />
    </SidebarProvider>
  );
}
