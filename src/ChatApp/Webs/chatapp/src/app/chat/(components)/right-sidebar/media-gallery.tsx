import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarGroup, SidebarSeparator } from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

export const MediaGallery = () => {
  return (
    <>
      <SidebarSeparator className="h-1" />
      <SidebarGroup>
        <Collapsible>
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <span className="font-semibold">Ảnh/Video</span>
            <ChevronDown size={20} />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-muted aspect-square rounded">
                  ?
                </div>
              ))}
            </div>
            <Button variant="link" className="w-full mt-2">
              Xem tất cả
            </Button>
          </CollapsibleContent>
        </Collapsible>
      </SidebarGroup>
    </>
  );
};
