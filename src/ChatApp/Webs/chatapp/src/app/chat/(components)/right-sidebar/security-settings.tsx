import { ChevronDown } from "lucide-react";
import { SidebarGroup, SidebarSeparator } from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

export const SecuritySettings = () => {
  return (
    <>
      <SidebarSeparator className="h-1" />
      <SidebarGroup>
        <Collapsible>
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <span className="font-semibold">Thiết lập bảo mật</span>
            <ChevronDown size={20} />
          </CollapsibleTrigger>
          <CollapsibleContent>
            {/* Thêm các tùy chọn bảo mật ở đây */}
          </CollapsibleContent>
        </Collapsible>
      </SidebarGroup>
    </>
  );
};
