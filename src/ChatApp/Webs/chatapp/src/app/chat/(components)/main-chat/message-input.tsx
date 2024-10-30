import { ImagePlus, FileVideo, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const MessageInput = () => {
  return (
    <div className="flex-none bg-background border-t-3">
      <div className="flex space-x-2 mb-2 border-b-3 p-2">
        <Button variant="outline" size="icon" className="h-12 w-12">
          <ImagePlus className="!w-5 !h-5" size={28} />
        </Button>
        <Button variant="outline" size="icon" className="h-12 w-12">
          <FileVideo className="!w-5 !h-5" size={28} />
        </Button>
      </div>
      <div className="flex items-center space-x-2 p-2">
        <Input
          placeholder="Nhập tin nhắn tới nhóm The family is to Love"
          className="flex-1 h-12 text-base"
        />
        <Button size="icon" className="h-12 w-12">
          <Send size={28} />
        </Button>
      </div>
    </div>
  );
};
