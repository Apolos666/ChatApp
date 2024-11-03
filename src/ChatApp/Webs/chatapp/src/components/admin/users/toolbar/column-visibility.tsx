import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, Columns2, RotateCcw } from "lucide-react";

interface ColumnVisibilityProps {
    columnVisibility: Record<string, boolean>;
    setColumnVisibility: (columnVisibility: Record<string, boolean>) => void;
}

const COLUMN_OPTIONS = [
    { value: "name", label: "Name" },
    { value: "email", label: "Email" },
    { value: "phone_number", label: "Phone Number" },
    { value: "role", label: "Role" },
    { value: "status", label: "Status" },
    { value: "created_at", label: "Joined At" },
] as const;

const DEFAULT_VISIBILITY = {
    name: true,
    email: true,
    phone_number: false,
    role: true,
    status: true,
    created_at: false,
} as const;

export function ColumnVisibility({ columnVisibility, setColumnVisibility }: ColumnVisibilityProps) {
    const isDefaultState = Object.entries(columnVisibility).every(
        ([key, value]) => DEFAULT_VISIBILITY[key as keyof typeof DEFAULT_VISIBILITY] === value
    );

    const toggleColumn = (columnKey: string) => {
        setColumnVisibility({
            ...columnVisibility,
            [columnKey]: !columnVisibility[columnKey],
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <Columns2 className="mr-2 h-4 w-4" />
                    Columns
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
                <div className="flex items-center justify-between">
                    <DropdownMenuLabel className="py-0">Toggle columns</DropdownMenuLabel>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setColumnVisibility(DEFAULT_VISIBILITY)}
                        disabled={isDefaultState}
                    >
                        <RotateCcw className="h-4 w-4" />
                    </Button>
                </div>
                <DropdownMenuSeparator />
                {COLUMN_OPTIONS.map((column) => (
                    <DropdownMenuItem
                        key={column.value}
                        onClick={() => toggleColumn(column.value)}
                        className="flex items-center justify-start"
                    >
                        <Check className={`h-4 w-4 ${!columnVisibility[column.value] ? "invisible" : ""}`} />
                        <span>{column.label}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
