"use client";

import { useEffect, useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { SignalRService } from "@/services/signalr";
import { addMessage, updateMessageStatus } from "@/store/features/messageSlice";
import type {
  MessageDto,
  MessageStatus,
  MessageStatusUpdate,
} from "@/app/chat/(types)/message";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";

export const MessageList = () => {
  const messages = useAppSelector((state) => state.messages.messages);
  const dispatch = useAppDispatch();
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const signalR = SignalRService.getInstance();

    const messageHandler = (message: MessageDto) => {
      dispatch(addMessage(message));
    };

    const statusUpdateHandler = (update: MessageStatusUpdate) => {
      dispatch(
        updateMessageStatus({
          messageId: update.messageId,
          status: update.status,
        })
      );
    };

    const initConnection = async () => {
      await signalR.startConnection();
      await signalR.joinRoom(1);

      const userId = Number(localStorage.getItem("chat_user_id"));
      setCurrentUserId(userId);

      signalR.onReceiveMessage(messageHandler);
      signalR.onMessageStatusUpdated(statusUpdateHandler);
    };

    initConnection();

    return () => {
      signalR.removeMessageHandler(messageHandler);
      signalR.removeStatusUpdateHandler(statusUpdateHandler);
    };
  }, [dispatch]);

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
              {msg.files && msg.files.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {msg.files.map((file) => (
                    <div key={file.id} className="relative">
                      {file.type.startsWith("image/") ? (
                        <Image
                          src={file.url}
                          alt={file.name}
                          width={300}
                          height={200}
                          quality={100}
                          className="w-full h-auto rounded object-cover"
                          loading="lazy"
                        />
                      ) : file.type.startsWith("video/") ? (
                        <video
                          src={file.url}
                          controls
                          className="w-full h-auto rounded"
                          preload="metadata"
                        />
                      ) : (
                        <div className="p-4 bg-muted rounded">
                          <p className="text-sm truncate">{file.name}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
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
