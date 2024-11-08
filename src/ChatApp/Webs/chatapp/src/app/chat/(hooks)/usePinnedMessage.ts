import { useMutation } from "@tanstack/react-query";
import { getLocalStorageItem } from "@/utils/local-storage";
import { PersistedStateKey } from "@/data/persisted-keys";
import { FileDto } from "../(types)/message";

interface MessagePinnedResponse {
    messageId: number;
    roomId: number;
    senderId: number;
    senderName: string;
    content: string;
    files: FileDto[];
    pinnedAt: string;
    success: boolean;
}
  
interface MessageUnpinnedResponse {
    messageId: number;
    success: boolean;
}

const BASE_URL = 'http://localhost:5221/api/messages';

export function usePinnedMessages() {
  const pinMessage = useMutation({
    mutationFn: async (messageId: number) => {
      const response = await fetch(`${BASE_URL}/${messageId}/pin`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getLocalStorageItem(PersistedStateKey.Token)}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to pin message');
      }

      return response.json() as Promise<MessagePinnedResponse>;
    }
  });

  const unpinMessage = useMutation({
    mutationFn: async (messageId: number) => {
      const response = await fetch(`${BASE_URL}/${messageId}/unpin`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getLocalStorageItem(PersistedStateKey.Token)}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to unpin message');
      }

      return response.json() as Promise<MessageUnpinnedResponse>;
    }
  });

  return {
    pinMessage,
    unpinMessage
  };
}