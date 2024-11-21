import { useMutation } from "@tanstack/react-query";
import { getLocalStorageItem } from "@/utils/local-storage";
import { PersistedStateKey } from "@/data/persisted-keys";

interface DeleteMessageResponse {
  messageId: number;
}

const BASE_URL = 'http://localhost:5221/api/messages';

export function useDeleteMessage() {
  return useMutation({
    mutationFn: async (messageId: number) => {
      const response = await fetch(`${BASE_URL}/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getLocalStorageItem(PersistedStateKey.Token)}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete message');
      }

      return response.json() as Promise<DeleteMessageResponse>;
    }
  });
} 