import { useEffect, useState, useRef } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { addMessage, updateMessageStatus, deleteMessage } from '@/store/features/messageSlice';
import type { MessageDto, MessageStatusUpdate, PinnedMessage } from '../(types)/message';
import { updateLastMessage } from '@/store/features/roomSlice';
import { TypingIndicator } from '../(types)/typing';
import { setTypingIndicator } from '@/store/features/typingSlice';
import { addPinnedMessage, removePinnedMessage } from '@/store/features/pinnedMessageSlice';
import { ChatSignalRService } from '@/services/signalrs/chat-signalr';

export function useSignalR(rooms: number[]) {
  const dispatch = useAppDispatch();
  const [isConnected, setIsConnected] = useState(false);
  const signalR = useRef(ChatSignalRService.getInstance());
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

    const pinStatusHandler = (pinStatus: PinnedMessage) => {
      if (pinStatus.isPinned) {
        dispatch(addPinnedMessage({
          id: pinStatus.id,
          roomId: pinStatus.roomId,
          senderId: pinStatus.senderId,
          senderName: pinStatus.senderName,
          content: pinStatus.content,
          files: pinStatus.files,
          pinnedAt: pinStatus.pinnedAt,
          isPinned: true
        }));
      } else {
        dispatch(removePinnedMessage({
          roomId: pinStatus.roomId,
          messageId: pinStatus.id
        }));
      }
    };

    const messageDeletedHandler = (update: {
      messageId: number;
      roomId: number;
      deletedBy: number;
      deletedAt: string;
    }) => {
      dispatch(deleteMessage({
        messageId: update.messageId,
      }));
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
        signalR.current.onMessagePinStatusChanged(pinStatusHandler);
        signalR.current.onMessageDeleted(messageDeletedHandler);
        
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
      signalR.current.removeMessagePinStatusHandler(pinStatusHandler);
      signalR.current.removeMessageDeletedHandler(messageDeletedHandler);
    };
  }, [dispatch, rooms, isConnected]);

  return isConnected;
}