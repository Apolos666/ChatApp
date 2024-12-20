import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/types/user";
import { useState, useEffect } from "react";
import { UserEditForm } from "./user-edit-form";
import { UserViewMode } from "./user-view-mode";
import { UserAddForm } from "./user-add-form";

interface UserModalProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
  onSave?: (updatedUser: User) => void;
  resetPassword?: User;
  initialEditMode?: boolean;
  initialAddMode?: boolean;
}

export function UserModal({
  user,
  open,
  onClose,
  onSave,
  initialEditMode = false,
  initialAddMode = false,
}: UserModalProps) {
  const [isEditMode, setIsEditMode] = useState(initialEditMode);
  const [isAddMode, setIsAddMode] = useState(initialAddMode);

  useEffect(() => {
    if (open) {
      setIsEditMode(initialEditMode);
      setIsAddMode(initialAddMode);
    } else {
      setIsEditMode(false);
      setIsAddMode(false);
    }
  }, [open, initialEditMode, initialAddMode]);

  const shouldRenderContent = isAddMode || user;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit User Details" : isAddMode ? "Add User" : "User Details"}
          </DialogTitle>
        </DialogHeader>

        {shouldRenderContent && (
          <>
            {isEditMode && user && (
              <UserEditForm
                user={user}
                onSave={onSave}
                onCancel={() => {
                  setIsEditMode(false);
                  onClose();
                }}
              />
            )}
            {isAddMode && (
              <UserAddForm
                user={null}
                onSave={onSave}
                onCancel={() => {
                  setIsAddMode(false);
                  onClose();
                }}
              />
            )}
            {!isEditMode && !isAddMode && user && (
              <UserViewMode user={user} onEdit={() => setIsEditMode(true)} />
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
