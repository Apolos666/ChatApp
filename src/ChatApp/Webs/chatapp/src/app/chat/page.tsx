"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { LeftSidebar } from "./(components)/left-sidebar";
import { MainChatArea } from "./(components)/main-chat";
import { RightSidebar } from "./(components)/right-sidebar";

export default function ChatInterface() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("chat_token");
    const userId = localStorage.getItem("chat_user_id");

    if (!token || !userId) {
      router.push("/");
    }
  }, [router]);

  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <LeftSidebar />
      <MainChatArea />
      <RightSidebar />
    </SidebarProvider>
  );
}
