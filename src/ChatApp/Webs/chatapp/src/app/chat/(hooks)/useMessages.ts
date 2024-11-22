import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import type { QueryFunction } from "@tanstack/react-query";
import { MessageDto } from "@/app/chat/(types)/message";
import { getLocalStorageItem } from "@/utils/local-storage";
import { PersistedStateKey } from "@/data/persisted-keys";
import { useEffect } from "react";

interface GetMessagesResponse {
  messages: MessageDto[];
  hasMore: boolean; 
}

type MessagesQueryKey = ["messages", "room", number];

const fetchMessages: QueryFunction<GetMessagesResponse, MessagesQueryKey, number | undefined> = 
  async ({ pageParam, queryKey }) => {
    const [, , roomId] = queryKey;
    const token = getLocalStorageItem(PersistedStateKey.Token);
    const response = await fetch(
      `http://localhost:5221/api/messages?roomId=${roomId}&pageSize=20${
        pageParam ? `&lastMessageId=${pageParam}` : ""
      }`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch messages");
    }

    return response.json();
  };

export function useMessages(roomId: number) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleMessageDeleted = () => {
      queryClient.invalidateQueries({ queryKey: ["messages", "room", roomId] });
    };

    return () => {
      // Cleanup listener
      handleMessageDeleted();
    };
  }, [queryClient, roomId]);

  return useInfiniteQuery({
    queryKey: ["messages", "room", roomId] as MessagesQueryKey,
    queryFn: fetchMessages,
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasMore) return undefined;
      const lastMessage = lastPage.messages[lastPage.messages.length - 1];
      return lastMessage?.id;
    },
    initialPageParam: undefined as number | undefined,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    staleTime: Infinity, 
  });
}