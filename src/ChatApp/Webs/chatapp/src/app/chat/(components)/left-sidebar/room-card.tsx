import { Users2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Room } from "../../(types)/room";

interface RoomCardProps {
  room: Room;
}

export const RoomCard = ({ room }: RoomCardProps) => {
  const lastMessageText = room.lastMessage
    ? `${room.lastMessage.senderName}: ${room.lastMessage.content}`
    : "Chưa có tin nhắn";

  return (
    <Card
      className={`hover:bg-accent cursor-pointer transition-colors ${
        room.unreadCount > 0 ? "bg-accent/50" : ""
      } ${
        room.selected
          ? "bg-accent border-primary border-2"
          : "border border-border"
      }`}
    >
      <CardContent className="p-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Users2 className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold truncate">{room.name}</div>
          <div className="text-sm text-muted-foreground truncate">
            {lastMessageText}
          </div>
        </div>
        {room.unreadCount > 0 && (
          <div className="w-5 h-5 rounded-full bg-primary flex-shrink-0 flex items-center justify-center">
            <span className="text-xs text-white">{room.unreadCount}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
