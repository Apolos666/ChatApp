import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table } from "@tanstack/react-table";

interface PageSizeSelectorProps<T> {
    table: Table<T>;
    onPageSizeChange: (size: number) => void;
}

export function PageSizeSelector<T>({ table, onPageSizeChange }: PageSizeSelectorProps<T>) {
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
            rows per page
        </span>
    );
} 