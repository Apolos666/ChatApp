import { MessageCircleMore, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const PinnedMessage = () => {
  return (
    <div className="flex-none bg-muted/30 border-b-3 p-3">
      <div className="flex items-center gap-3">
        <MessageCircleMore className="h-7 w-7 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-muted-foreground">
              Tin nhắn đã ghim
            </span>
            <span className="text-xs text-muted-foreground">21:00</span>
          </div>
          <p className="text-sm truncate">
            Jonas: Hello, something something something something something
            something
          </p>
        </div>
        <Button variant="ghost" size="icon" className="flex-shrink-0">
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
