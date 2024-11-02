import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table } from "@tanstack/react-table";
import { User as UserType } from "@/types";

interface PageSizeSelectorProps {
    table: Table<UserType>;
    onPageSizeChange: (size: number) => void;
}

export function PageSizeSelector({ table, onPageSizeChange }: PageSizeSelectorProps) {
    return (
        <span className="flex items-center gap-1 text-sm text-muted-foreground">
            Rows per page:
            <Select
                value={table.getState().pagination.pageSize.toString()}
                onValueChange={(value) => {
                    const size = Number(value);
                    table.setPageSize(size);
                    onPageSizeChange(size);
                }}
            >
                <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent>
                    {[5, 10, 20].map((pageSize) => (
                        <SelectItem key={pageSize} value={pageSize.toString()}>
                            {pageSize}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </span>
    );
} 