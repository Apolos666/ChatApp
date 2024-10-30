import { ChevronDown } from "lucide-react";
import { SidebarGroup, SidebarSeparator } from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

export const MemberList = () => {
  return (
    <>
      <SidebarSeparator className="h-1" />
      <SidebarGroup>
        <Collapsible>
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <span className="font-semibold">Thành viên nhóm</span>
            <ChevronDown size={20} />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <p className="text-sm text-muted-foreground mt-2">21 thành viên</p>
          </CollapsibleContent>
        </Collapsible>
      </SidebarGroup>
    </>
  );
};
