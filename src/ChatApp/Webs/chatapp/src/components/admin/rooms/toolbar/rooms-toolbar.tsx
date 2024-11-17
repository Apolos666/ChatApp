import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { Table } from "@tanstack/react-table";
import { Room } from "@/types";
import { useState } from "react";

interface RoomsToolbarProps {
    table: Table<Room>,
    onAdd: () => void;
}

export const RoomsToolbar = ({ table, onAdd }: RoomsToolbarProps) => {
    const [searchValue, setSearchValue] = useState<string>("");
    return (
        <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
                <h2 className="font-semibold">
                    {table.getState().columnFilters.length > 0
                        ? `Rooms found (${table.getRowCount()})`
                        : `All Rooms (${table.getRowCount()})`}
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
                <Button variant="default" onClick={onAdd}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Room
                </Button>
            </div>
        </div>
    )
}