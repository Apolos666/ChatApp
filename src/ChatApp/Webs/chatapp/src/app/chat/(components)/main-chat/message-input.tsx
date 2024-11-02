"use client";

import { useState, useRef, useCallback } from "react";
import { useAppDispatch } from "@/store/hooks";
import {
  addMessage,
  updateTempMessage,
  setMessageFailed,
} from "@/store/features/messageSlice";
import type { MessageDto } from "@/app/chat/(types)/message";
import { FilePreview } from "./file-preview";
import { FileControls } from "./file-controls";
import { MessageTextInput } from "./message-text-input";

export const MessageInput = () => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const [selectedFiles, setSelectedFiles] = useState<{
    images: File[];
    videos: File[];
  }>({
    images: [],
    videos: [],
  });

  const handleImageSelect = useCallback(() => {
    imageInputRef.current?.click();
  }, []);

  const handleVideoSelect = useCallback(() => {
    videoInputRef.current?.click();
  }, []);

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setSelectedFiles((prev) => ({
          ...prev,
          images: Array.from(e.target.files || []),
        }));
      }
    },
    []
  );

  const handleVideoChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setSelectedFiles((prev) => ({
          ...prev,
          videos: Array.from(e.target.files || []),
        }));
      }
    },
    []
  );

  const removeFile = useCallback((type: "images" | "videos", index: number) => {
    setSelectedFiles((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));

    if (type === "images" && imageInputRef.current) {
      imageInputRef.current.value = "";
    }
    if (type === "videos" && videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  }, []);

  const sendMessage = useCallback(async () => {
    const files = [...selectedFiles.images, ...selectedFiles.videos];

    if ((!message.trim() && !files.length) || isSending) return;

    const currentUserId = Number(localStorage.getItem("chat_user_id"));
    const content = message.trim();
    const tempId = Date.now();

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
    setSelectedFiles({ images: [], videos: [] });

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
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
      if (videoInputRef.current) {
        videoInputRef.current.value = "";
      }
    }
  }, [message, isSending, dispatch, selectedFiles]);

  const handleMessageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setMessage(e.target.value);
    },
    []
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        sendMessage();
      }
    },
    [sendMessage]
  );

  return (
    <div className="flex-none bg-background border-t-3">
      <FilePreview
        images={selectedFiles.images}
        videos={selectedFiles.videos}
        onRemove={removeFile}
      />
      <FileControls
        onImageSelect={handleImageSelect}
        onVideoSelect={handleVideoSelect}
        imageInputRef={imageInputRef}
        videoInputRef={videoInputRef}
        onImageChange={handleImageChange}
        onVideoChange={handleVideoChange}
      />
      <MessageTextInput
        message={message}
        isSending={isSending}
        onMessageChange={handleMessageChange}
        onSend={sendMessage}
        onKeyPress={handleKeyPress}
      />
    </div>
  );
};
