export interface MessageDto {
  id: number;
  content: string | null;
  roomId: number;
  senderId: number;
  senderName: string;
  createdAt: string;
  status: MessageStatus;
  files?: FileDto[];
  isDeleted: boolean;
}

export interface FileDto {
  id: number;
  name: string;
  url: string;
  createdAt: string;
  type: string;
}

export type MessageStatus = 'Sending' | 'Sent' | 'Failed' | 'Delivered' | 'Seen';

export interface MessageStatusUpdate {
  messageId: number;
  status: MessageStatus;
  error?: string;
}

export interface PinnedMessage {
  id: number;
  roomId: number;
  senderId: number;
  senderName: string;
  content: string;
  files: FileDto[];
  pinnedAt: string;
  isPinned: boolean;
}

export interface MessageDeletedDto {
  messageId: number;
  roomId: number;
  deletedBy: number;
  deletedAt: string;
}