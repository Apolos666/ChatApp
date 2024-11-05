import { MessageSquare } from "lucide-react";

export const NoRoomSelected = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
      <MessageSquare className="h-16 w-16 mb-4" />
      <h2 className="text-2xl font-semibold mb-2">Chưa chọn phòng chat</h2>
      <p>Vui lòng chọn một phòng chat để bắt đầu trò chuyện</p>
    </div>
  );
};
