import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import type { MessageStatus } from "@/app/chat/(types)/message";
import { ArrowDownToDot, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { useMessages } from "../../(hooks)/useMessages";
import { Button } from "@/components/ui/button";

interface MessageListProps {
  roomId: number;
}

export const MessageList = ({ roomId }: MessageListProps) => {
  const reduxMessages = useAppSelector((state) => state.messages.messages);
  const {
    data: queryData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMessages(roomId);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "50px 0px 0px 0px",
  });
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const canFetchMoreRef = useRef(true);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const userIdStr = localStorage.getItem("chat_user_id");
    if (userIdStr) {
      setCurrentUserId(parseInt(userIdStr, 10));
    }
  }, []);

  const allMessages = useMemo(() => {
    const queryMessages =
      queryData?.pages.flatMap((page) => page.messages) ?? [];
    return [...queryMessages, ...reduxMessages]
      .filter((msg) => msg.roomId === roomId)
      .sort((a, b) => a.id - b.id);
  }, [queryData, reduxMessages, roomId]);

  const scrollToBottom = useCallback(() => {
    if (shouldScrollToBottom) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "instant",
        block: "end",
      });
    }
  }, [shouldScrollToBottom]);

  useEffect(() => {
    if (reduxMessages.length > 0 && shouldScrollToBottom) {
      const hasImages = reduxMessages.some((msg) =>
        msg.files?.some((file) => file.type?.startsWith("image/"))
      );

      if (hasImages) {
        setTimeout(scrollToBottom, 300);
      } else {
        setTimeout(scrollToBottom, 0);
      }
    }
  }, [reduxMessages, scrollToBottom, shouldScrollToBottom]);

  useEffect(() => {
    if (queryData?.pages.length === 1 && !initialLoadComplete) {
      const hasImages = queryData.pages[0].messages.some((msg) =>
        msg.files?.some((file) => file.type?.startsWith("image/"))
      );

      setTimeout(
        () => {
          setInitialLoadComplete(true);
          messagesEndRef.current?.scrollIntoView({
            behavior: "instant",
            block: "end",
          });
        },
        hasImages ? 300 : 100
      );
    }
  }, [initialLoadComplete, queryData?.pages]);

  useEffect(() => {
    if (initialLoadComplete && allMessages.length > 0) {
      const hasImages = allMessages.some((msg) =>
        msg.files?.some((file) => file.type?.startsWith("image/"))
      );

      if (hasImages) {
        setTimeout(scrollToBottom, 300);
      } else {
        scrollToBottom();
      }
    }
  }, [initialLoadComplete, allMessages, scrollToBottom]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
    setShouldScrollToBottom(isNearBottom);

    const scrollThreshold = 500;
    const shouldShowButton =
      scrollHeight - scrollTop - clientHeight > scrollThreshold;

    setShowScrollButton(shouldShowButton);
  }, []);

  const scrollToBottomManually = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
    setShouldScrollToBottom(true);
  }, []);

  useEffect(() => {
    if (
      inView &&
      hasNextPage &&
      !isFetchingNextPage &&
      initialLoadComplete &&
      canFetchMoreRef.current
    ) {
      canFetchMoreRef.current = false;

      const scrollContainer = scrollContainerRef.current;
      if (scrollContainer) {
        const previousScrollHeight = scrollContainer.scrollHeight;
        const previousScrollTop = scrollContainer.scrollTop;

        fetchNextPage().then(() => {
          requestAnimationFrame(() => {
            if (scrollContainer) {
              const newScrollHeight = scrollContainer.scrollHeight;
              const heightDifference = newScrollHeight - previousScrollHeight;
              scrollContainer.scrollTop = previousScrollTop + heightDifference;

              setTimeout(() => {
                canFetchMoreRef.current = true;
              }, 500);
            }
          });
        });
      }
    }
  }, [
    inView,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    initialLoadComplete,
  ]);

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
    <div
      ref={scrollContainerRef}
      className="flex-1 overflow-y-auto p-4 space-y-4 messages-scrollbar bg-slate-300"
      onScroll={handleScroll}
    >
      {initialLoadComplete && (
        <div ref={ref} className="h-4 w-full">
          {isFetchingNextPage && (
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}
        </div>
      )}

      <div className="space-y-4">
        {allMessages.map((msg) => (
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
                        {file.type && file.type.startsWith("image/") ? (
                          <Image
                            src={file.url}
                            alt={file.name}
                            width={300}
                            height={200}
                            quality={100}
                            className="w-full h-auto rounded object-cover"
                            loading="lazy"
                            onError={(e) => {
                              console.error(
                                `Error loading image: ${file.url}`,
                                e
                              );
                            }}
                          />
                        ) : file.type && file.type.startsWith("video/") ? (
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
              <CardFooter className="py-1 px-3 flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {new Date(msg.createdAt).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {msg.senderId === currentUserId && getStatusIcon(msg.status)}
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
      {showScrollButton && (
        <div className="sticky bottom-4 left-0 right-0 flex justify-center">
          <Button
            onClick={scrollToBottomManually}
            size="icon"
            className="rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <ArrowDownToDot className="!h-5 !w-5" />
          </Button>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
