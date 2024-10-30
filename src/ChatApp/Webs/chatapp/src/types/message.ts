export interface MessageDto {
  id: number;
  content: string;
  roomId: number;
  senderId: number;
  senderName: string;
  createdAt: string;
  status: string;
} 