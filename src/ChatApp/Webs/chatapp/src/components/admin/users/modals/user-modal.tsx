import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/types/user";
import { useState, useEffect } from "react";
import { UserAvatar } from "../table/user-avatar";
import { UserEditForm } from "./user-edit-form";
import { UserViewMode } from "./user-view-mode";

interface UserModalProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
  onSave?: (updatedUser: User) => void;
  resetPassword?: User;
  initialEditMode?: boolean;
}

export function UserModal({
  user,
  open,
  onClose,
  onSave,
  initialEditMode = false,
}: UserModalProps) {
  const [isEditMode, setIsEditMode] = useState(initialEditMode);

  useEffect(() => {
    if (open) {
      setIsEditMode(initialEditMode);
    } else {
      setIsEditMode(false);
    }
  }, [open, initialEditMode]);

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit User Details" : "User Details"}
          </DialogTitle>
        </DialogHeader>

        <UserAvatar user={user} isEditMode={isEditMode} />

        {isEditMode ? (
          <UserEditForm
            user={user}
            onSave={onSave}
            onCancel={() => setIsEditMode(false)}
          />
        ) : (
          <UserViewMode user={user} onEdit={() => setIsEditMode(true)} />
        )}
      </DialogContent>
    </Dialog>
  );
}
