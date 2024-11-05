import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { User } from "@/types/user";
import { useDebounce } from "@/hooks/use-debounce";
import { useState, useEffect, useRef } from "react";
import { ColumnVisibility } from "./column-visibility";
import FilterButton, { Filters, FilterButtonRef } from "./filter-button";
import { RotateCcw } from "lucide-react";

interface UsersToolbarProps {
    table: Table<User>;
    columnVisibility: Record<string, boolean>;
    setColumnVisibility: (columnVisibility: Record<string, boolean>) => void;
    filters: Filters;
    setFilters: (filters: Filters) => void;
}

export function UsersToolbar({
    table,
    columnVisibility,
    setColumnVisibility,
    filters,
    setFilters,
}: UsersToolbarProps) {
    const [searchValue, setSearchValue] = useState<string>("");
    const debouncedSearchValue = useDebounce(searchValue, 300);
    const filterButtonRef = useRef<FilterButtonRef>(null);

    useEffect(() => {
        const columnFilters = [
            {
                id: "name",
                value: debouncedSearchValue,
            },
        ];

        // Only add role/status filters if they have values
        if (filters.role.length > 0) {
            columnFilters.push({ 
                id: "role", 
                value: filters.role,
            });
        }
        
        if (filters.status.length > 0) {
            columnFilters.push({ 
                id: "status", 
                value: filters.status,
            });
        }

        table.setColumnFilters(columnFilters);
    }, [debouncedSearchValue, table, filters]);

    return (
        <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
                <h2 className="font-semibold">
                    {table.getState().columnFilters.length > 0
                        ? `Users found (${table.getRowCount()})`
                        : `All Users (${table.getRowCount()})`}
                </h2>
                {(table.getState().columnFilters.length > 0 || Object.keys(table.getState().rowSelection).length > 0) && (
                    <Button 
                        variant="ghost" 
                        className="h-8 px-2 text-muted-foreground"
                        onClick={() => {
                            setSearchValue("");
                            filterButtonRef.current?.resetFilters();
                            table.resetRowSelection();
                        }}
                    >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Reset all
                    </Button>
                )}
            </div>
            <div className="flex gap-3">
                <Input
                    placeholder="Search name..."
                    className="max-w-md"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                <FilterButton 
                    ref={filterButtonRef}
                    filters={filters} 
                    setFilters={setFilters} 
                />
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
