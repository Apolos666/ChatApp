import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";
import { Filter, Plus } from "lucide-react";
import { User } from "@/types/user";
import { useDebounce } from "@/hooks/use-debounce";
import { useState, useEffect } from "react";
import { ColumnVisibility } from "./column-visibility";

interface UsersToolbarProps {
    table: Table<User>;
    columnVisibility: Record<string, boolean>;
    setColumnVisibility: (columnVisibility: Record<string, boolean>) => void;
}

export function UsersToolbar({ 
    table, 
    columnVisibility, 
    setColumnVisibility 
}: UsersToolbarProps) {
    const [searchValue, setSearchValue] = useState<string>("");
    const debouncedSearchValue = useDebounce(searchValue, 300);

    useEffect(() => {
        table.setColumnFilters([
            {
                id: "name",
                value: debouncedSearchValue,
            },
        ]);
    }, [debouncedSearchValue, table]);

    return (
        <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
                <h2 className="font-semibold">
                    {table.getState().columnFilters.length > 0
                        ? `Users found (${table.getRowCount()})`
                        : `All Users (${table.getRowCount()})`}
                </h2>
            </div>
            <div className="flex gap-3">
                <Input
                    placeholder="Search name..."
                    className="max-w-md"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                </Button>
                <ColumnVisibility 
                    columnVisibility={columnVisibility}
                    setColumnVisibility={setColumnVisibility}
                />
                <Button variant="default">
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                </Button>
            </div>
        </div>
    );
}
