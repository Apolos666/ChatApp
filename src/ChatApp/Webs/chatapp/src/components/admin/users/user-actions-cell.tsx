import { User as UserType } from "@/types";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, MoreHorizontal, Pencil, Trash2, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserActionsCellProps {
    user: UserType;
    onEdit?: (user: UserType) => void;
    onView?: (user: UserType) => void;
}

export function UserActionsCell({
    user,
    onEdit,
    onView,
}: UserActionsCellProps) {
    const { toast } = useToast();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />   
                <DropdownMenuItem
                    onClick={() => {
                        navigator.clipboard.writeText(user.id);
                        toast({
                            title: "Copied ID",
                            description:
                                "User ID has been copied to clipboard.",
                        });
                    }}
                >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy ID
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onView?.(user)}>
                    <User className="mr-2 h-4 w-4" />
                    View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => {
                        onEdit?.(user);
                    }}
                >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
