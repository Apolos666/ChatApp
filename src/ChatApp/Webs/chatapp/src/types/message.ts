export type MessageStatus = "sending" | "sent" | "failed" | "delivered" | "seen";

export interface MessageDto {
  id: number;
  content: string;
  roomId: number;
  senderId: number;
  senderName: string;
  createdAt: string;
  status: MessageStatus;
}

export interface MessageStatusUpdate {
  messageId: number;
  status: MessageStatus;
  error?: string;
} 