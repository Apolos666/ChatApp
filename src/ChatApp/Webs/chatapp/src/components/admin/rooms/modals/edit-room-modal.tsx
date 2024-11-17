import { Dialog, DialogTitle, DialogHeader, DialogContent, DialogDescription } from "@/components/ui/dialog"
import { Room } from "@/types"

interface EditRoomModalProps {
    room: Room
    onClose: () => void
}

export const EditRoomModal = ({ room, onClose }: EditRoomModalProps) => {
    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Room</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    {room.name}
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}