"use client";

import { useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    SortingState,
    ColumnFiltersState,
    flexRender,
    OnChangeFn,
    VisibilityState,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { User as UserType } from "@/types";
import { UserModal } from "../modals/user-modal";
import { mockUsers } from "@/mocks/mockUsers";
import { UsersToolbar } from "../toolbar/users-toolbar";
import { getColumns } from "./columns";
import { PageSizeSelector } from "./page-size-selector";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import RowActions from "./row-actions";
import { Filters } from "../toolbar/filter-button";

export function UsersTable() {
    const { toast } = useToast();
    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [resetPassword, setResetPassword] = useState<UserType | null>(null);
    const [pageSize, setPageSize] = useState(5);
    const [filters, setFilters] = useState<Filters>({ role: [], status: [], startDate: null, endDate: null });
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        name: true,
        email: true,
        phone_number: false,
        role: true,
        status: true,
        created_at: false,
    });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState({});
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const handleSave = (updatedUser: UserType) => {
        console.log("Updated user:", updatedUser);
        setIsEditMode(false);
        setSelectedUser(updatedUser);
        toast({
            title: "User updated",
            description: "User has been updated successfully.",
        });
    };

    const handleDelete = (ids: string[]) => {
        console.log("Deleted users:", ids);
        toast({
            title: "Users deleted",
            description: "Users have been deleted successfully.",
        });
    };

    // Initialize the table with data and configurations
    const table = useReactTable({
        data: mockUsers,
        columns: getColumns({
            setSelectedUser,
            setIsEditMode,
            handleDelete,
            setResetPassword,
        }),
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: setColumnFilters,
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        onColumnVisibilityChange:
            setColumnVisibility as OnChangeFn<VisibilityState>,
        enableColumnResizing: true,
        state: {
            sorting,
            rowSelection,
            columnFilters,
            columnVisibility,
        },
        initialState: {
            pagination: {
                pageSize: pageSize,
            },
        },
    });

    

    return (
        <>
            {/* Toolbar for user actions and column visibility */}
            <UsersToolbar
                table={table}
                columnVisibility={columnVisibility}
                setColumnVisibility={setColumnVisibility}
                filters={filters}
                setFilters={setFilters}
            />

            {/* Conditional rendering of row actions if any row is selected */}
            {table.getSelectedRowModel().rows.length > 0 && (
                <RowActions table={table} onDelete={handleDelete} />
            )}

            {/* Main table display */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className={cn({
                                            "w-[30px]": header.id === "select",
                                            "w-[250px]": header.id === "name",
                                            "w-[200px]": [
                                                "email",
                                                "phone_number",
                                            ].includes(header.id),
                                            "w-[150px]": [
                                                "created_at",
                                                "role",
                                                "status",
                                            ].includes(header.id),
                                            "w-[100px]":
                                                header.id === "actions",
                                        })}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef
                                                    .header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={
                                        table.getHeaderGroups()[0].headers
                                            .length
                                    }
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination and page size selector */}
            <div className="flex items-center">
                <div className="flex-1">
                    <PageSizeSelector
                        table={table}
                        onPageSizeChange={setPageSize}
                    />
                </div>
                <div className="flex-1 flex justify-center">
                    <DataTablePagination table={table} />
                </div>
                <div className="flex-1" />
            </div>

            {/* Modal for editing user details */}
            <UserModal
                user={selectedUser}
                open={!!selectedUser}
                onClose={() => {
                    setSelectedUser(null);
                    setIsEditMode(false);
                }}
                onSave={handleSave}
                initialEditMode={isEditMode}
            />
        </>
    );
}
