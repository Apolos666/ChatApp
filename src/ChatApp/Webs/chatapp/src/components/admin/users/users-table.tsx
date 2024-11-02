"use client";

import { useState } from "react";
import { useReactTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel, getFilteredRowModel, SortingState, ColumnFiltersState, flexRender, OnChangeFn, VisibilityState } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User as UserType } from "@/types";
import { UserModal } from "./user-modal";
import { mockUsers } from "@/mocks/mockUsers";
import { UsersToolbar } from "./users-toolbar";
import { getColumns } from "./table/columns";
import { PageSizeSelector } from "./page-size-selector";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { useToast } from "@/hooks/use-toast";

export function UsersTable() {
    const { toast } = useToast();
    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [pageSize, setPageSize] = useState(5);
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

    const table = useReactTable({
        data: mockUsers,
        columns: getColumns({
            setSelectedUser,
            setIsEditMode,
        }),
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: setColumnFilters,
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        onColumnVisibilityChange: setColumnVisibility as OnChangeFn<VisibilityState>,
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

    const handleSave = (updatedUser: UserType) => {
        console.log("Updated user:", updatedUser);
        setIsEditMode(false);
        setSelectedUser(updatedUser);
        toast({
            title: "User updated",
            description: "User has been updated successfully.",
        });
    };

    return (
        <>
            <UsersToolbar 
                table={table}
                columnVisibility={columnVisibility}
                setColumnVisibility={setColumnVisibility}
            />
            <PageSizeSelector table={table} onPageSizeChange={setPageSize} />
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
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
                                    colSpan={table.getHeaderGroups()[0].headers.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
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
