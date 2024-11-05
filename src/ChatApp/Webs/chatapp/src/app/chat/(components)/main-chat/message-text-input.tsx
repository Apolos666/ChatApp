import { memo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface MessageTextInputProps {
  message: string;
  isSending: boolean;
  onMessageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export const MessageTextInput = memo(
  ({
    message,
    isSending,
    onMessageChange,
    onSend,
    onKeyPress,
  }: MessageTextInputProps) => {
    return (
      <div className="flex items-center space-x-2 p-2">
        <Input
          value={message}
          onChange={onMessageChange}
          onKeyPress={onKeyPress}
          placeholder="Nhập tin nhắn tới nhóm The family is to Love"
          className="flex-1 h-12 text-base"
          disabled={isSending}
        />
        <Button
          size="icon"
          className="h-12 w-12"
          onClick={onSend}
          disabled={isSending}
        >
          <Send size={28} />
        </Button>
      </div>
    );
  }
);

MessageTextInput.displayName = "MessageTextInput";
