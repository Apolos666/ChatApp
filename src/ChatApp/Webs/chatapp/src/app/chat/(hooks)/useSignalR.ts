import { useEffect, useState, useRef } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { SignalRService } from '@/services/signalr';
import { addMessage, updateMessageStatus } from '@/store/features/messageSlice';
import type { MessageDto, MessageStatusUpdate } from '../(types)/message';
import { updateLastMessage } from '@/store/features/roomSlice';

export function useSignalR(rooms: number[]) {
  const dispatch = useAppDispatch();
  const [isConnected, setIsConnected] = useState(false);
  const signalR = useRef(SignalRService.getInstance());
  const isInitializing = useRef(false);

  useEffect(() => {
    const messageHandler = (message: MessageDto) => {
      dispatch(addMessage(message));
      dispatch(updateLastMessage(message));
    };

    const statusUpdateHandler = (update: MessageStatusUpdate) => {
      dispatch(updateMessageStatus({
        messageId: update.messageId,
        status: update.status,
      }));
    };

    const initConnection = async () => {
      if (isInitializing.current) {
        return;
      }
      
      isInitializing.current = true;
      setIsConnected(false); 

      try {
        if (!signalR.current.isConnected()) {
          await signalR.current.startConnection();
        }

        await Promise.all(rooms.map(roomId => signalR.current.joinRoom(roomId)));

        signalR.current.onReceiveMessage(messageHandler);
        signalR.current.onMessageStatusUpdated(statusUpdateHandler);
        
        setIsConnected(true);
      } catch (error) {
        console.error('SignalR connection error:', error);
        setIsConnected(false);
      } finally {
        isInitializing.current = false;
      }
    };

    if (!isConnected && rooms.length > 0) {
      initConnection();
    }

    return () => {
      signalR.current.removeMessageHandler(messageHandler);
      signalR.current.removeStatusUpdateHandler(statusUpdateHandler);
    };
  }, [dispatch, rooms, isConnected]);

  return isConnected;
}