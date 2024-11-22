import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getLocalStorageItem } from "@/utils/local-storage";
import { PersistedStateKey } from "@/data/persisted-keys";
import { useAppDispatch } from "@/store/hooks";
import { deleteMessage } from "@/store/features/messageSlice";

interface DeleteMessageResponse {
  messageId: number;
}

const BASE_URL = 'http://localhost:5221/api/messages';

export function useDeleteMessage() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

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

      const data = await response.json() as DeleteMessageResponse;
      
      dispatch(deleteMessage({ messageId }));
      
      queryClient.invalidateQueries({ 
        queryKey: ["messages"]
      });

      return data;
    }
  });
} 