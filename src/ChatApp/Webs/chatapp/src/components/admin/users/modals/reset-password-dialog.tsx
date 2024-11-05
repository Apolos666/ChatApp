import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/types/user";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { toast } from "@/hooks/use-toast";

interface ResetPasswordDialogProps {
  user: User;
  onClose: () => void;
  open: boolean;
}

const DEFAULT_NEW_PASSWORD = "12345678";

export function ResetPasswordDialog({
  user,
  onClose,
  open,
}: ResetPasswordDialogProps) {
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const passwordToUse = newPassword || DEFAULT_NEW_PASSWORD;
    console.log(
      "Resetting password for user: ",
      user.id,
      ". New password: ",
      passwordToUse
    );
    onClose();
    setNewPassword("");
    toast({
      title: "Password reset",
      description: "Password has been reset for user " + user.id,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset Password for {user.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>New Password</Label>
              <PasswordInput
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
              <span className="text-xs italic text-muted-foreground">
                Leave blank to reset to default password:{" "}
                <b>{DEFAULT_NEW_PASSWORD}</b>
              </span>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Reset Password</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
