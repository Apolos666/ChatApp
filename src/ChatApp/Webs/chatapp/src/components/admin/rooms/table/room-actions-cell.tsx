import { Button } from "@/components/ui/button";
import { Copy, MoreHorizontal, Trash, Users } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Room } from "@/types";
import { toast } from "sonner";
import { DeleteConfirmationDialog } from "../../users/modals/delete-confirmation-dialog";
import { useState } from "react";

interface RoomActionsCellProps {
    room: Room;
    onManage?: (room: Room) => void;
    onDelete?: (room: Room) => void;
}

export function RoomActionsCell({ room, onManage, onDelete }: RoomActionsCellProps) {
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false)
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
                            navigator.clipboard.writeText(room.id);
                            toast.success("Room ID has been copied to clipboard.")
                        }}
                    >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy ID
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onManage?.(room)}>
                        <Users className="h-4 w-4 mr-2" />
                        Manage Room
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setOpenConfirmationModal(true)}>
                        <Trash className="h-4 w-4 mr-2 text-destructive" />
                        <span className="text-destructive">Delete Room</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DeleteConfirmationDialog
                open={openConfirmationModal}
                onOpenChange={setOpenConfirmationModal}
                onConfirm={() => onDelete?.(room)}
                itemCount={1}
                itemType="room"
            />
        </>
    );
}