import { useCallback, useEffect, useRef } from 'react';
import { useAppSelector } from '@/store/hooks';
import debounce from 'lodash/debounce';
import { ChatSignalRService } from '@/services/signalrs/chat-signalr';

export function useTypingIndicator(roomId: number) {
  const signalR = useRef(ChatSignalRService.getInstance());
  const typingUsers = useAppSelector(
    (state) => state.typing.typingUsers[roomId] || []
  );
  
  const sendTypingIndicator = useCallback(
    debounce((isTyping: boolean) => {
      signalR.current.sendTypingIndicator(roomId, isTyping);
    }, 300),
    [roomId]
  );

  useEffect(() => {
    return () => {
      sendTypingIndicator.cancel();
    };
  }, [sendTypingIndicator]);

  return {
    typingUsers,
    sendTypingIndicator
  };
}