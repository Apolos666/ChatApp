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
      setMessages((prev) => {
        // Kiểm tra xem tin nhắn đã tồn tại chưa
        const existingMessage = prev.find((m) => m.id === message.id);
        if (existingMessage) {
          // Giữ nguyên status hiện tại nếu nó là "sent" hoặc "delivered" hoặc "seen"
          return prev.map((m) =>
            m.id === message.id
              ? {
                  ...message,
                  status: ["sent", "delivered", "seen"].includes(m.status)
                    ? m.status
                    : message.status,
                }
              : m
          );
        }

        // Tìm tin nhắn tạm thời (nếu có)
        const tempMessage = prev.find(
          (m) =>
            m.status === "sending" &&
            m.content === message.content &&
            m.senderId === message.senderId
        );

        if (tempMessage) {
          // Cập nhật tin nhắn tạm thời với thông tin từ server
          return prev
            .map((m) =>
              m.id === tempMessage.id
                ? {
                    ...message,
                    id: message.id,
                    status: "sent" as MessageStatus,
                  }
                : m
            )
            .filter((m) => m.id !== message.id); // Loại bỏ tin nhắn trùng lặp
        }

        // Nếu là tin nhắn mới từ người khác
        if (message.senderId !== currentUserId) {
          return [...prev, message];
        }

        return prev;
      });
    };

    const statusUpdateHandler = (update: MessageStatusUpdate) => {
      console.log("Handling status update:", update);
      setMessages((prev) =>
        prev.map((message) =>
          message.id === update.messageId
            ? { ...message, status: update.status }
            : message
        )
      );
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
      case "sending":
        return <Loader2 className="h-3 w-3 animate-spin" />;
      case "sent":
        return <span className="text-xs">✓</span>;
      case "delivered":
        return <span className="text-xs">✓✓</span>;
      case "seen":
        return <span className="text-xs text-blue-500">✓✓</span>;
      case "failed":
        return <span className="text-xs text-red-500">!</span>;
      default:
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
