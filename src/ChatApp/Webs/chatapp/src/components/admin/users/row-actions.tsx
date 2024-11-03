import { Table } from "@tanstack/react-table";
import { User } from "@/types/user";
import { Trash2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface RowActionsProps {
    table: Table<User>;
    onDelete: (ids: string[]) => void;
}

export default function RowActions({ table, onDelete }: RowActionsProps) {
    const [open, setOpen] = useState(false);
    const selectedCount = table.getSelectedRowModel().rows.length;

    return (
        <div className="flex items-center gap-2 px-4">
            <span className="text-sm text-muted-foreground">
                {`${selectedCount} row${selectedCount > 1 ? "s" : ""} selected`}
            </span>
            {selectedCount > 0 ? (
                <button
                    onClick={() => setOpen(true)}
                    className="text-destructive hover:text-destructive/80"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            ) : (
                <Trash2 className="h-4 w-4 text-muted-foreground hover:cursor-pointer" />
            )}

            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm deletion</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete {selectedCount}{" "}
                            selected {selectedCount > 1 ? "items" : "item"}?
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/80"
                            onClick={() =>
                                onDelete(
                                    table
                                        .getSelectedRowModel()
                                        .rows.map((row) => row.original.id)
                                )
                            }
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
