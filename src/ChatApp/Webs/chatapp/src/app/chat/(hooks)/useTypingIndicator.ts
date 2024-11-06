import { useCallback, useEffect, useRef } from 'react';
import { useAppSelector } from '@/store/hooks';
import { SignalRService } from '@/services/signalr';
import debounce from 'lodash/debounce';

export function useTypingIndicator(roomId: number) {
  const signalR = useRef(SignalRService.getInstance());
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