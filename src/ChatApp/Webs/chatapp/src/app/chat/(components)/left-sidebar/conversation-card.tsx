import { Users2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Conversation } from "../types";

interface ConversationCardProps {
  conversation: Conversation;
}

export const ConversationCard = ({ conversation }: ConversationCardProps) => {
  return (
    <Card
      className={`hover:bg-accent cursor-pointer transition-colors ${
        conversation.unread ? "bg-accent/50" : ""
      } ${
        conversation.selected
          ? "bg-accent border-primary border-2"
          : "border border-border"
      }`}
    >
      <CardContent className="p-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Users2 className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold truncate">{conversation.name}</div>
          <div className="text-sm text-muted-foreground truncate">
            {conversation.lastMessage}
          </div>
        </div>
        {conversation.unread && (
          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
        )}
      </CardContent>
    </Card>
  );
};
