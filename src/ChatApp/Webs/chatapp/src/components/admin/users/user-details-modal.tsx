import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { User } from "@/types";

interface UserDetailsModalProps {
    user: User | null;
    open: boolean;
    onClose: () => void;
}

export function UserDetailsModal({ user, open, onClose }: UserDetailsModalProps) {
    if (!user) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>User Details</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <div className="font-semibold text-right">Name:</div>
                        <div className="col-span-3">{user.name}</div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <div className="font-semibold text-right">Email:</div>
                        <div className="col-span-3">{user.email}</div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <div className="font-semibold text-right">Phone:</div>
                        <div className="col-span-3">{user.phone_number}</div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <div className="font-semibold text-right">Date of Birth:</div>
                        <div className="col-span-3">
                            {format(new Date(user.dob), 'PP')}
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <div className="font-semibold text-right">Address:</div>
                        <div className="col-span-3">{user.address}</div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <div className="font-semibold text-right">Role:</div>
                        <div className="col-span-3">{user.role}</div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <div className="font-semibold text-right">Status:</div>
                        <div className="col-span-3">{user.status.charAt(0).toUpperCase() + user.status.slice(1)}</div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <div className="font-semibold text-right">Joined:</div>
                        <div className="col-span-3">
                            {format(new Date(user.created_at), 'PP')}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}