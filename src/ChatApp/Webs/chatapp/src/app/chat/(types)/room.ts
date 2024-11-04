export interface Room {
    id: number;
    name: string;
    lastMessage?: {
        content: string;
        senderName: string;
        createdAt: string;
    };
    updatedAt?: string;
    createdAt: string;
    selected?: boolean;
    unreadCount: number;
  }