import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table } from "@tanstack/react-table";
import { User as UserType } from "@/types";

interface PageSizeSelectorProps {
    table: Table<UserType>;
    onPageSizeChange: (size: number) => void;
}

export function PageSizeSelector({ table, onPageSizeChange }: PageSizeSelectorProps) {
    return (
        <span className="flex items-center gap-1 px-4 text-sm text-muted-foreground">
            Show
            <Select
                value={table.getState().pagination.pageSize.toString()}
                onValueChange={(value) => {
                    const size = Number(value);
                    table.setPageSize(size);
                    onPageSizeChange(size);
                }}
            >
                <SelectTrigger className="h-8 w-[60px] mx-2">
                    <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top" className="w-full">
                    {[5, 10, 20].map((pageSize) => (
                        <SelectItem key={pageSize} value={pageSize.toString()}>
                            {pageSize}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            pages
        </span>
    );
} 