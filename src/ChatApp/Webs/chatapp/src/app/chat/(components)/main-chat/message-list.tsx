"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { SignalRService } from "@/services/signalr";
import type { MessageDto } from "@/types/message";

export const MessageList = () => {
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    const signalR = SignalRService.getInstance();

    const messageHandler = (message: MessageDto) => {
      setMessages((prev) => [...prev, message]);
    };

    const initConnection = async () => {
      await signalR.startConnection();
      await signalR.joinRoom(1);

      const userId = Number(localStorage.getItem("chat_user_id"));
      setCurrentUserId(userId);

      signalR.onReceiveMessage(messageHandler);
    };

    initConnection();

    return () => {
      signalR.removeMessageHandler(messageHandler);
    };
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 messages-scrollbar bg-slate-300">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${
            msg.senderId === currentUserId ? "justify-end" : "justify-start"
          }`}
        >
          <Card
            className={`max-w-xs ${
              msg.senderId === currentUserId
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            }`}
          >
            <CardHeader className="py-1 px-3">
              <p className="font-semibold">{msg.senderName}</p>
            </CardHeader>
            <CardContent className="py-1 px-3">
              <p>{msg.content}</p>
            </CardContent>
            <CardFooter className="py-1 px-3">
              <p className="text-xs">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </p>
            </CardFooter>
          </Card>
        </div>
      ))}
    </div>
  );
};
