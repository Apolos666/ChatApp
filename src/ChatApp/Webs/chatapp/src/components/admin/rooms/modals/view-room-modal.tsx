import { Dialog, DialogTitle, DialogHeader, DialogContent, DialogDescription } from "@/components/ui/dialog"
import { Room } from "@/types/room"

interface ViewRoomModalProps {
    room: Room
    onClose: () => void
}

export const ViewRoomModal = ({ room, onClose }: ViewRoomModalProps) => {
    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Room Details</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    {room.name}
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}