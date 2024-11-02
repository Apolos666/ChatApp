export interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  unread: boolean;
  avatar?: string;
  selected?: boolean;
}
