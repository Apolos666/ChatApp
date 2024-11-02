"use client";

import { useState, useRef } from "react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const sendMessage = async () => {
    if ((!message.trim() && !fileInputRef.current?.files?.length) || isSending)
      return;

    const currentUserId = Number(localStorage.getItem("chat_user_id"));
    const content = message.trim();
    const tempId = Date.now();
    const files = fileInputRef.current?.files
      ? Array.from(fileInputRef.current.files)
      : [];

    const tempFiles = files.map((file, index) => ({
      id: tempId + index,
      name: file.name,
      url: URL.createObjectURL(file),
      createdAt: new Date().toISOString(),
      type: file.type,
    }));

    const tempMessage: MessageDto = {
      id: tempId,
      content,
      roomId: 1,
      senderId: currentUserId,
      senderName: "You",
      createdAt: new Date().toISOString(),
      status: "Sending",
      files: tempFiles,
    };

    const formData = new FormData();
    formData.append("content", content);
    formData.append("roomId", "1");

    files.forEach((file) => {
      formData.append("files", file);
    });

    dispatch(addMessage(tempMessage));
    setIsSending(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5221/api/messages/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("chat_token")}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to send message");

      const result = await response.json();
      dispatch(updateTempMessage({ tempId, realId: result.messageId }));

      tempFiles.forEach((file) => URL.revokeObjectURL(file.url));
    } catch (error) {
      console.error("Error sending message:", error);
      dispatch(setMessageFailed(tempId));
    } finally {
      setIsSending(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="flex-none bg-background border-t-3">
      <div className="flex space-x-2 mb-2 border-b-3 p-2">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept="image/*,video/*"
          onChange={() => {}}
        />
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12"
          onClick={handleFileSelect}
        >
          <ImagePlus className="!w-5 !h-5" size={28} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12"
          onClick={handleFileSelect}
        >
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
