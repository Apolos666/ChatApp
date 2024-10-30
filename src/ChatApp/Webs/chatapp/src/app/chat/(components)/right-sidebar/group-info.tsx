import { Users, Pin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";

export const GroupInfo = () => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="font-semibold mb-2 text-base text-typography-heading">
        The family is to Love
      </SidebarGroupLabel>
      <div className="space-y-4">
        <SidebarGroupContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start h-12">
            <Users size={24} className="mr-2" />
            <span>Thêm thành viên</span>
          </Button>
          <Button variant="outline" className="w-full justify-start h-12">
            <Pin size={24} className="mr-2" />
            <span>Ghim hội thoại</span>
          </Button>
        </SidebarGroupContent>
      </div>
    </SidebarGroup>
  );
};
