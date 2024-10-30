"use client";

import { useEffect, useState, useRef } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { SignalRService } from "@/services/signalr";
import type {
  MessageDto,
  MessageStatus,
  MessageStatusUpdate,
} from "@/types/message";

export const MessageList = () => {
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const signalR = SignalRService.getInstance();

    const messageHandler = (message: MessageDto) => {
      console.log("Received message:", message);
      setMessages((prev) => {
        console.log("Previous messages:", prev);

        // Kiểm tra xem tin nhắn đã tồn tại chưa
        const existingMessage = prev.find((m) => m.id === message.id);
        console.log("Existing message:", existingMessage);

        if (existingMessage) {
          console.log(
            "Message exists, current status:",
            existingMessage.status
          );
          // Giữ nguyên status hiện tại nếu nó là "sent" hoặc "delivered" hoặc "seen"
          const updatedMessages = prev.map((m) =>
            m.id === message.id
              ? {
                  ...message,
                  status: ["Sent", "Delivered", "Seen"].includes(m.status)
                    ? m.status
                    : message.status,
                }
              : m
          );
          console.log("Updated messages:", updatedMessages);
          return updatedMessages;
        }

        // Tìm tin nhắn tạm thời (nếu có)
        const tempMessage = prev.find(
          (m) =>
            m.status === "sending" &&
            m.content === message.content &&
            m.senderId === message.senderId
        );
        console.log("Temp message found:", tempMessage);

        if (tempMessage) {
          console.log("Updating temp message with real message");
          const updatedMessages = prev
            .map((m) =>
              m.id === tempMessage.id
                ? {
                    ...message,
                    id: message.id,
                    status: "sent" as MessageStatus,
                  }
                : m
            )
            .filter((m) => m.id !== message.id);
          console.log("Messages after temp update:", updatedMessages);
          return updatedMessages;
        }

        // Nếu là tin nhắn mới từ người khác
        if (message.senderId !== currentUserId) {
          console.log("New message from other user");
          return [...prev, message];
        }

        console.log("No changes made to messages");
        return prev;
      });
    };

    const statusUpdateHandler = (update: MessageStatusUpdate) => {
      console.log("Status update received:", update);
      setMessages((prev) => {
        console.log("Previous messages before status update:", prev);
        const updatedMessages = prev.map((message) =>
          message.id === update.messageId
            ? { ...message, status: update.status }
            : message
        );
        console.log("Messages after status update:", updatedMessages);
        return updatedMessages;
      });
    };

    const updateMessageHandler = ((
      event: CustomEvent<{ tempId: number; realId: number }>
    ) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === event.detail.tempId
            ? {
                ...msg,
                id: event.detail.realId,
                status: "sent" as MessageStatus,
              }
            : msg
        )
      );
    }) as EventListener;

    const messageFailedHandler = ((event: CustomEvent<number>) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === event.detail
            ? { ...msg, status: "failed" as MessageStatus }
            : msg
        )
      );
    }) as EventListener;

    const initConnection = async () => {
      await signalR.startConnection();
      await signalR.joinRoom(1);

      const userId = Number(localStorage.getItem("chat_user_id"));
      setCurrentUserId(userId);

      signalR.onReceiveMessage(messageHandler);
      signalR.onMessageStatusUpdated(statusUpdateHandler);
    };

    initConnection();

    // Chỉ đăng ký các event cần thiết
    window.addEventListener("update-message", updateMessageHandler);
    window.addEventListener("message-failed", messageFailedHandler);

    return () => {
      signalR.removeMessageHandler(messageHandler);
      signalR.removeStatusUpdateHandler(statusUpdateHandler);
      window.removeEventListener("update-message", updateMessageHandler);
      window.removeEventListener("message-failed", messageFailedHandler);
    };
  }, [currentUserId]);

  const getStatusIcon = (status: MessageStatus) => {
    switch (status) {
      case "Sending":
        return <Loader2 className="h-3 w-3 animate-spin" />;
      case "Sent":
        return <span className="text-xs">✓</span>;
      case "Delivered":
        return <span className="text-xs">✓✓</span>;
      case "Seen":
        return <span className="text-xs text-blue-500">✓✓</span>;
      case "Failed":
        return <span className="text-xs text-red-500">!</span>;
      default:
        console.log("Unknown status:", status);
        return null;
    }
  };

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
            <CardFooter className="py-1 px-3 flex justify-between items-center gap-2">
              <p className="text-xs">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </p>
              {msg.senderId === currentUserId && (
                <div className="flex items-center">
                  {getStatusIcon(msg.status)}
                </div>
              )}
            </CardFooter>
          </Card>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
