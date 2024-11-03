import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Filter, RotateCcw } from "lucide-react";
import { useState } from "react";
import { UserRole, UserStatus } from "@/types/user";

type Role = UserRole;
type Status = UserStatus;

export interface Filters {
    role: Role[];
    status: Status[];
    startDate: Date | null;
    endDate: Date | null;
}

interface FilterButtonProps {
    filters: Filters;
    setFilters: (filters: Filters) => void;
}

const DEFAULT_FILTERS: Filters = {
    role: [],
    status: [],
    startDate: null,
    endDate: null,
};

const ROLES: Role[] = ['Admin', 'User', 'Moderator'];
const STATUSES: Status[] = ['active', 'inactive'];

export default function FilterButton({ filters, setFilters }: FilterButtonProps) {
    const [localFilters, setLocalFilters] = useState<Filters>(filters);

    const toggleFilter = (type: keyof Pick<Filters, 'role' | 'status'>, value: Role | Status) => {
        setLocalFilters((prev) => {
            const currentValues = prev[type] as (Role | Status)[];
            const isValueSelected = currentValues.includes(value);

            const updatedValues = isValueSelected
                ? currentValues.filter((v) => v !== value)
                : [...currentValues, value];

            return {
                ...prev,
                [type]: updatedValues,
            };
        });
    };

    const resetFilters = () => {
        setLocalFilters(DEFAULT_FILTERS);
        setFilters?.(DEFAULT_FILTERS);
    };

    const applyFilters = () => {
        setFilters?.(localFilters);
    };

    const hasChanges = () => {
        return JSON.stringify(localFilters) !== JSON.stringify(filters);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[250px] px-2">
                <div className="flex items-center justify-between">
                    <DropdownMenuLabel className="py-0">Filters</DropdownMenuLabel>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={resetFilters}
                        disabled={JSON.stringify(localFilters) === JSON.stringify(DEFAULT_FILTERS)}
                    >
                        <RotateCcw className="h-4 w-4" />
                    </Button>
                </div>
                <DropdownMenuSeparator />
                <div className="space-y-4 p-2">
                    <div className="space-y-2">
                        <div className="font-light text-sm">Role</div>
                        <div className="flex flex-wrap gap-2">
                            {ROLES.map((role) => (
                                <Badge
                                    key={role}
                                    variant={localFilters.role.includes(role) ? "default" : "outline"}
                                    className="cursor-pointer text-sm font-light"
                                    onClick={() => toggleFilter('role', role)}
                                >
                                    {role}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="font-light text-sm">Status</div>
                        <div className="flex flex-wrap gap-2">
                            {STATUSES.map((status) => (
                                <Badge
                                    key={status}
                                    variant={localFilters.status.includes(status) ? "default" : "outline"}
                                    className="cursor-pointer text-sm font-light"
                                    onClick={() => toggleFilter('status', status)}
                                >
                                    {status}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
                <Button 
                    className="mt-4 w-full" 
                    onClick={applyFilters}
                    disabled={!hasChanges()}
                >
                    Apply Filters
                </Button>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
