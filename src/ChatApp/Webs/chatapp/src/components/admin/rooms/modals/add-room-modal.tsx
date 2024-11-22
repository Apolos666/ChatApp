import { Dialog, DialogTitle, DialogHeader, DialogContent, DialogDescription } from "@/components/ui/dialog"

interface AddRoomModalProps {
    onClose: () => void
}

export const AddRoomModal = ({ onClose }: AddRoomModalProps) => {
    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Add Room</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Add a new room to the system
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}