import { Search, UserRoundPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const SearchBar = () => {
  return (
    <div className="p-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search
            className="text-gray-600 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={24}
          />
          <Input
            placeholder="Tìm kiếm"
            className="pl-12 h-12 text-lg !bg-gray-300"
          />
        </div>
        <Button variant="ghost" size="icon" className="h-12 w-12">
          <UserRoundPlus className="!h-7 !w-7" />
        </Button>
      </div>
    </div>
  );
};
