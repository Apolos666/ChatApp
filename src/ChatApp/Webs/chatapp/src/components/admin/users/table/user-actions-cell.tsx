import { User as UserType } from "@/types";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, Edit, Eye, Lock, MoreHorizontal, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { DeleteConfirmationDialog } from "../modals/delete-confirmation-dialog";
import { ResetPasswordDialog } from "../modals/reset-password-dialog";

interface UserActionsCellProps {
    user: UserType;
    onEdit?: (user: UserType) => void;
    onView?: (user: UserType) => void;
    onDelete?: (user: UserType) => void;
    onResetPassword?: (user: UserType) => void;
}

export function UserActionsCell({
    user,
    onEdit,
    onView,
    onDelete,
}: UserActionsCellProps) {
    const { toast } = useToast();

    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [openResetPasswordModal, setOpenResetPasswordModal] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
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
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            onEdit?.(user);
                        }}
                    >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            setOpenResetPasswordModal(true);
                        }}
                    >
                        <Lock className="mr-2 h-4 w-4" />
                        Reset Password
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setOpenConfirmationModal(true)}
                        className="text-destructive"
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DeleteConfirmationDialog
                open={openConfirmationModal}
                onOpenChange={setOpenConfirmationModal}
                onConfirm={() => {
                    onDelete?.(user);
                    setOpenConfirmationModal(false);
                }}
                itemCount={1}
                itemType="user"
            />

            <ResetPasswordDialog
                user={user}
                onClose={() => setOpenResetPasswordModal(false)}
                open={openResetPasswordModal}
            />
        </>
    );
}
