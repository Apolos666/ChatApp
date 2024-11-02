import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockUsers } from "@/mocks/mockUsers";
import { Filter, Plus, Settings2 } from "lucide-react";

export function UsersToolbar() {
    return (
        <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
                <h2 className="font-semibold">
                    {`All Users (${mockUsers.length})`}
                </h2>
                
            </div>
            <div className="flex gap-3">
                <Input placeholder="Search users..." className="max-w-md" />
                <Button variant="outline">
                    <Filter className="h-4 w-4" />
                    Filter
                </Button>
                <Button variant="outline">
                    <Settings2 className="h-4 w-4" />
                    View
                </Button>
                <Button variant="default">
                    <Plus className="h-4 w-4" />
                    Add User
                </Button>
            </div>
        </div>
    );
}
