import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Filter, RotateCcw } from "lucide-react";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { USER_ROLES, USER_STATUS } from "@/types/user";

export interface Filters {
    role_id: number[];
    is_active: boolean[];
    startDate: Date | null;
    endDate: Date | null;
}

export interface FilterButtonRef {
    resetFilters: () => void;
}

interface FilterButtonProps {
    filters: Filters;
    setFilters: (filters: Filters) => void;
}

const DEFAULT_FILTERS: Filters = {
    role_id: [],
    is_active: [],
    startDate: null,
    endDate: null,
};

const FilterButton = forwardRef<FilterButtonRef, FilterButtonProps>(({ filters = DEFAULT_FILTERS, setFilters }, ref) => {
    const [localFilters, setLocalFilters] = useState<Filters>({
        role_id: filters.role_id || [],
        is_active: filters.is_active || [],
        startDate: filters.startDate || null,
        endDate: filters.endDate || null,
    });

    useEffect(() => {
        setLocalFilters({
            role_id: filters.role_id || [],
            is_active: filters.is_active || [],
            startDate: filters.startDate || null,
            endDate: filters.endDate || null,
        });
    }, [filters]);

    const toggleRoleFilter = (roleId: number) => {
        setLocalFilters((prev) => {
            const currentValues = prev.role_id;
            const isValueSelected = currentValues.includes(roleId);

            return {
                ...prev,
                role_id: isValueSelected
                    ? currentValues.filter((v) => v !== roleId)
                    : [...currentValues, roleId],
            };
        });
    };

    const toggleStatusFilter = (status: boolean) => {
        setLocalFilters((prev) => {
            const currentValues = prev.is_active;
            const isValueSelected = currentValues.includes(status);

            return {
                ...prev,
                is_active: isValueSelected
                    ? currentValues.filter((v) => v !== status)
                    : [...currentValues, status],
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

    const getFilterCount = () => {
        let count = 0;
        if (localFilters.role_id.length > 0) count++;
        if (localFilters.is_active.length > 0) count++;
        return count;
    };

    const hasChanges = () => {
        return JSON.stringify(localFilters) !== JSON.stringify(filters);
    };

    useImperativeHandle(ref, () => ({
        resetFilters
    }));

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline"> 
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                    {!hasChanges() && (localFilters.role_id.length > 0 || localFilters.is_active.length > 0) && (
                        <Badge variant="outline" className="ml-2 rounded-full">
                            {getFilterCount()}
                        </Badge>
                    )}
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
                        <div className="font-light text-sm text-muted-foreground">Role</div>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(USER_ROLES).map(([id, role]) => (
                                <Badge
                                    key={id}
                                    variant={localFilters.role_id.includes(Number(id)) ? "default" : "outline"}
                                    className="cursor-pointer text-sm font-light"
                                    onClick={() => toggleRoleFilter(Number(id))}
                                >
                                    {role}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="font-light text-sm text-muted-foreground">Account Status</div>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(USER_STATUS).map(([value, label]) => (
                                <Badge
                                    key={value}
                                    variant={localFilters.is_active.includes(value === 'true') ? "default" : "outline"}
                                    className="cursor-pointer text-sm font-light"
                                    onClick={() => toggleStatusFilter(value === 'true')}
                                >
                                    {label}
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
});

FilterButton.displayName = "FilterButton";

export default FilterButton;