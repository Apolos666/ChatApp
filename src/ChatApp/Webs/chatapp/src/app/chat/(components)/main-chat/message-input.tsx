"use client";

import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import {
  addMessage,
  updateTempMessage,
  setMessageFailed,
} from "@/store/features/messageSlice";
import type { MessageDto } from "@/types/message";
import { Button } from "@/components/ui/button";
import { FileVideo, ImagePlus, Send } from "lucide-react";
import { Input } from "@/components/ui/input";

export const MessageInput = () => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const dispatch = useAppDispatch();

  const sendMessage = async () => {
    if (!message.trim() || isSending) return;

    const currentUserId = Number(localStorage.getItem("chat_user_id"));
    const content = message.trim();
    const tempId = Date.now();

    const tempMessage: MessageDto = {
      id: tempId,
      content,
      roomId: 1,
      senderId: currentUserId,
      senderName: "You",
      createdAt: new Date().toISOString(),
      status: "Sending",
    };

    dispatch(addMessage(tempMessage));
    setIsSending(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5221/api/messages/send-text",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("chat_token")}`,
          },
          body: JSON.stringify({
            content,
            roomId: 1,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to send message");

      const result = await response.json();
      dispatch(updateTempMessage({ tempId, realId: result.messageId }));
    } catch (error) {
      console.error("Error sending message:", error);
      dispatch(setMessageFailed(tempId));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex-none bg-background border-t-3">
      <div className="flex space-x-2 mb-2 border-b-3 p-2">
        <Button variant="outline" size="icon" className="h-12 w-12">
          <ImagePlus className="!w-5 !h-5" size={28} />
        </Button>
        <Button variant="outline" size="icon" className="h-12 w-12">
          <FileVideo className="!w-5 !h-5" size={28} />
        </Button>
      </div>
      <div className="flex items-center space-x-2 p-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
          placeholder="Nhập tin nhắn tới nhóm The family is to Love"
          className="flex-1 h-12 text-base"
          disabled={isSending}
        />
        <Button
          size="icon"
          className="h-12 w-12"
          onClick={sendMessage}
          disabled={isSending}
        >
          <Send size={28} />
        </Button>
      </div>
    </div>
  );
};
