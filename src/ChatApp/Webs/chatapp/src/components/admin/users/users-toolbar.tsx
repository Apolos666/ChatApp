import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Settings2 } from "lucide-react";

export function UsersToolbar() {
    return (
        <div className="flex items-center justify-between">
            <div className="flex gap-3">
                <Input placeholder="Search users..." className="max-w-xs" />
                <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                </Button>
            </div>
            <div className="flex">
                <Button variant="outline" size="icon">
                    <Settings2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
