import { useInfiniteQuery } from "@tanstack/react-query";
import type { QueryFunction } from "@tanstack/react-query";
import { MessageDto } from "@/app/chat/(types)/message";

interface GetMessagesResponse {
  messages: MessageDto[];
  hasMore: boolean; 
}

type MessagesQueryKey = ["messages", "room", number];

const fetchMessages: QueryFunction<GetMessagesResponse, MessagesQueryKey, number | undefined> = 
  async ({ pageParam, queryKey }) => {
    const [, , roomId] = queryKey;
    const token = localStorage.getItem("chat_token");
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