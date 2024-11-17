import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import { DialogClose } from "@/components/ui/dialog";
import { ViewFields } from "./view-fields";
import { User } from "@/types/user";

interface UserViewModeProps {
    user: User;
    onEdit: () => void;
    onSave?: () => void;
}

export function UserViewMode({ user, onEdit, onSave }: UserViewModeProps) {
    return (
        <div className="grid gap-6">
            <ViewFields user={user} onSave={onSave} />
            <div className="flex justify-between">
                <DialogClose asChild>
                    <Button type="button" variant="outline">
                        Close
                    </Button>
                </DialogClose>
                <Button
                    type="button"
                    variant="default"
                    onClick={onEdit}
                    className="flex items-center gap-2"
                >
                    <PencilIcon className="h-4 w-4" />
                    Edit
                </Button>   
            </div>
        </div>
    );
} 