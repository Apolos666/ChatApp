import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { GroupInfo } from "./group-info";
import { MemberList } from "./member-list";
import { MediaGallery } from "./media-gallery";
import { SecuritySettings } from "./security-settings";

export const RightSidebar = () => {
  return (
    <Sidebar side="right">
      <SidebarHeader className="border-b-4 p-4 text-center">
        <h2 className="font-semibold text-lg">Thông tin nhóm</h2>
      </SidebarHeader>
      <SidebarContent>
        <GroupInfo />
        <MemberList />
        <MediaGallery />
        <SecuritySettings />
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Button variant="destructive" className="w-full h-12">
          <LogOut size={24} className="mr-2" />
          <span>Rời khỏi nhóm</span>
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
