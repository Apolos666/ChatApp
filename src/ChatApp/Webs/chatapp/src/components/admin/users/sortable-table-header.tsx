import { Button } from "@/components/ui/button";
import { Column } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

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
    return (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className={`w-full px-1 ${align === "center" ? "justify-center" : align === "right" ? "justify-end" : "justify-start"}`}
        >
            {title}
            <ArrowUpDown className="h-4 w-4" />
        </Button>
    );
}
