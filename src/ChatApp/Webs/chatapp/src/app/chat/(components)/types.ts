export interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  unread: boolean;
  avatar?: string;
  selected?: boolean;
}

export interface Message {
  id: number;
  sender: string;
  content: string;
  time: string;
} 