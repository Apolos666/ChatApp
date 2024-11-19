import { Dialog, DialogTitle, DialogHeader, DialogContent, DialogDescription } from "@/components/ui/dialog"
import { Room } from "@/types"

interface ManageUsersModalProps {
    room: Room
    onClose: () => void
}

export const ManageUsersModal = ({ room, onClose }: ManageUsersModalProps) => {
    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Manage Users</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    {room.name}
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}