import { CircleUserRound, UserRoundPlus, Search, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

export const ChatHeader = () => {
  return (
    <div className="flex-none bg-background p-4 flex justify-between items-center border-b-3">
      <div className="space-y-1">
        <h2 className="font-semibold text-xl">The family is to Love</h2>
        <span className="flex gap-2 items-center">
          <CircleUserRound size={20} />
          <p className="text-muted-foreground">21 thành viên</p>
        </span>
      </div>
      <div className="flex space-x-5 items-center">
        <Button variant="ghost">
          <UserRoundPlus className="!h-7 !w-7" size={28} />
        </Button>
        <Button variant="ghost">
          <Search className="!h-7 !w-7" size={28} />
        </Button>
        <Button variant="ghost">
          <Video className="!h-7 !w-7" size={28} />
        </Button>
        <SidebarTrigger className="rotate-180" />
      </div>
    </div>
  );
};
