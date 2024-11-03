import { Button } from "@/components/ui/button";
import { Column } from "@tanstack/react-table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SortableTableHeaderProps<TData, TValue> {
    column: Column<TData, TValue>;
    title: string;
    align?: "left" | "center" | "right";
}

export function SortableTableHeader<TData, TValue>({
    column,
    title,
    align = "left",
}: SortableTableHeaderProps<TData, TValue>) {
    const isSorted = column.getIsSorted();

    return (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(isSorted === "asc")}
            className={cn(
                "w-full px-1 gap-1",
                {
                    "justify-center": align === "center",
                    "justify-end": align === "right",
                    "justify-start": align === "left"
                }
            )}
        >
            {title}
            {isSorted === "asc" ? (
                <ArrowDown className="h-4 w-4" />
            ) : isSorted === "desc" ? (
                <ArrowUp className="h-4 w-4" />
            ) : (
                <ArrowUpDown className="h-4 w-4 opacity-50" />
            )}
        </Button>
    );
}
