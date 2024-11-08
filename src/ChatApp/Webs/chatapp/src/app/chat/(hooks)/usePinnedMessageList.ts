import { useQuery } from "@tanstack/react-query";
import { useAppDispatch } from "@/store/hooks";
import { getLocalStorageItem } from "@/utils/local-storage";
import { PersistedStateKey } from "@/data/persisted-keys";
import { setPinnedMessages } from "@/store/features/pinnedMessageSlice";
import type { PinnedMessage } from "../(types)/message";

interface GetPinnedMessagesResponse {
  messages: PinnedMessage[];
}

const BASE_URL = 'http://localhost:5221/api/messages';

export function usePinnedMessageList(roomId: number) {
  const dispatch = useAppDispatch();

  return useQuery({
    queryKey: ['pinnedMessages', roomId],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/${roomId}/pinned`, {
        headers: {
          'Authorization': `Bearer ${getLocalStorageItem(PersistedStateKey.Token)}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pinned messages');
      }

      const data = await response.json() as GetPinnedMessagesResponse;
      
      dispatch(setPinnedMessages({
        roomId,
        messages: data.messages
      }));

      return data;
    },
    enabled: !!roomId,
  });
}