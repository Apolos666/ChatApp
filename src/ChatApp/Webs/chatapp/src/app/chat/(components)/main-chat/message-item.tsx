import { memo } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import type { MessageDto, MessageStatus } from "../../(types)/message";

interface MessageItemProps {
  message: MessageDto;
  isOwnMessage: boolean;
}

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
      return null;
  }
};

export const MessageItem = memo(
  ({ message, isOwnMessage }: MessageItemProps) => {
    return (
      <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
        <Card
          className={`max-w-xs ${
            isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted"
          }`}
        >
          <CardHeader className="py-1 px-3">
            <p className="font-semibold">{message.senderName}</p>
          </CardHeader>
          <CardContent className="py-1 px-3">
            <p>{message.content}</p>
            {message.files && message.files.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {message.files.map((file) => (
                  <div key={file.id} className="relative">
                    {file.type?.startsWith("image/") ? (
                      <Image
                        src={file.url}
                        alt={file.name}
                        width={300}
                        height={200}
                        quality={100}
                        className="w-full h-auto rounded object-cover"
                        loading="lazy"
                      />
                    ) : file.type?.startsWith("video/") ? (
                      <video
                        src={file.url}
                        controls
                        width={300}
                        height={200}
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
          <CardFooter className="py-1 px-3 flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              {new Date(message.createdAt).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {isOwnMessage && getStatusIcon(message.status)}
          </CardFooter>
        </Card>
      </div>
    );
  }
);

MessageItem.displayName = "MessageItem";
