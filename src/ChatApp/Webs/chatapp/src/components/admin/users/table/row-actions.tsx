import { useState } from "react";
import { Table } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/admin/users/modals/delete-confirmation-dialog";

interface RowActionsProps<T extends { id: string }> {
    table: Table<T>;
    onDelete: (ids: string[]) => void;
}

export default function RowActions<T extends { id: string }>({ table, onDelete }: RowActionsProps<T>) {
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

            <DeleteConfirmationDialog
                open={open}
                onOpenChange={setOpen}
                onConfirm={() => {
                    onDelete(
                        table.getSelectedRowModel().rows.map((row) => row.original.id)
                    );
                    setOpen(false);
                }}
                itemCount={selectedCount}
                itemType={`selected ${selectedCount > 1 ? "items" : "item"}`}
            />
        </div>
    );
}
