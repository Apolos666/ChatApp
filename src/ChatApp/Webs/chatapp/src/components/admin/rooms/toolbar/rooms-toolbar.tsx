import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { Table } from "@tanstack/react-table";
import { Room } from "@/types";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";

export interface Filters {
    name: string
}

interface RoomsToolbarProps {
    table: Table<Room>,
    filters: Filters,
    setFilters: (filters: Filters) => void,
    onAdd: () => void;
    isLoading: boolean;
    setIsFilterLoading: (value: boolean) => void;
}

export const RoomsToolbar = ({ 
    table, 
    filters, 
    setFilters, 
    onAdd, 
    isLoading,
    setIsFilterLoading 
}: RoomsToolbarProps) => {
    const [searchValue, setSearchValue] = useState<string>("");
    const debouncedSearchValue = useDebounce(searchValue, 600);

    useEffect(() => {
        setIsFilterLoading(true);
        const columnFilters = [
            {
                id: "name",
                value: debouncedSearchValue,
            }
        ]

        table.setColumnFilters(columnFilters);
        
        const timer = setTimeout(() => {
            setIsFilterLoading(false);
        }, 400);

        return () => clearTimeout(timer);
    }, [debouncedSearchValue, table, setIsFilterLoading])

    return (
        <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
                <h2 className="font-semibold">
                    {
                        table.getState().columnFilters.length > 0
                            ? `Rooms found (${isLoading ? '...' : table.getRowModel().rows.length})`
                            : `All Rooms (${isLoading ? '...' : table.getRowModel().rows.length})`
                    }
                </h2>
                {(table.getState().columnFilters.length > 0 || Object.keys(table.getState().rowSelection).length > 0) && (
                    <Button 
                        variant="ghost" 
                        className="h-8 px-2 text-muted-foreground"
                        onClick={() => {
                            setSearchValue("");
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
                <Button 
                    variant="default" 
                    onClick={onAdd} 
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Room
                </Button>
            </div>
        </div>
    )
}