import { useEffect, useState, useRef } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { SignalRService } from '@/services/signalr';
import { addMessage, updateMessageStatus } from '@/store/features/messageSlice';
import type { MessageDto, MessageStatusUpdate } from '../(types)/message';
import { updateLastMessage } from '@/store/features/roomSlice';
import { TypingIndicator } from '../(types)/typing';
import { setTypingIndicator } from '@/store/features/typingSlice';

export function useSignalR(rooms: number[]) {
  const dispatch = useAppDispatch();
  const [isConnected, setIsConnected] = useState(false);
  const signalR = useRef(SignalRService.getInstance());
  const isInitializing = useRef(false);
  const connectedRooms = useRef<Set<number>>(new Set());

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

    const typingHandler = (typing: TypingIndicator) => {
      dispatch(setTypingIndicator(typing));
    };

    const initConnection = async () => {
      if (isInitializing.current) return;
      
      isInitializing.current = true;
      
      try {
        if (!signalR.current.isConnected()) {
          await signalR.current.startConnection();
        }

        signalR.current.onReceiveMessage(messageHandler);
        signalR.current.onMessageStatusUpdated(statusUpdateHandler);
        signalR.current.onTypingIndicatorReceived(typingHandler);
        
        setIsConnected(true);
      } catch (error) {
        console.error('SignalR connection error:', error);
        setIsConnected(false);
      } finally {
        isInitializing.current = false;
      }
    };

    const joinRooms = async () => {
      if (!isConnected || rooms.length === 0) return;

      try {
        for (const roomId of rooms) {
          if (!connectedRooms.current.has(roomId)) {
            await signalR.current.joinRoom(roomId);
            connectedRooms.current.add(roomId);
          }
        }
      } catch (error) {
        console.error('Error joining rooms:', error);
      }
    };

    if (!isConnected) {
      initConnection();
    } else {
      joinRooms();
    }

    return () => {
      signalR.current.removeMessageHandler(messageHandler);
      signalR.current.removeStatusUpdateHandler(statusUpdateHandler);
      signalR.current.removeTypingIndicatorHandler(typingHandler);
    };
  }, [dispatch, rooms, isConnected]);

  return isConnected;
}