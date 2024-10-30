"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Copy,
    MoreHorizontal,
    Pencil,
    Trash2,
    User,
    ArrowUpDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { User as UserType } from "@/types";
import { UserDetailsModal } from "./user-details-modal";

const mockUsers: UserType[] = [
    {
        id: "728ed52f",
        name: "John Smith",
        email: "john@example.com",
        role: "User",
        status: "active",
        phone_number: "+1 (555) 123-4567",
        dob: "1990-05-15T00:00:00Z",
        address: "123 Main Street, New York, NY 10001",
        password: "hashed_password_1",
        created_at: "2024-01-15T08:30:00Z",
    },
    {
        id: "489e1d42",
        name: "Sarah Johnson",
        email: "sarah@example.com",
        role: "Admin",
        status: "active",
        phone_number: "+1 (555) 987-6543",
        dob: "1988-08-20T00:00:00Z",
        address: "456 Oak Avenue, San Francisco, CA 94105",
        password: "hashed_password_2",
        created_at: "2024-01-10T14:15:00Z",
    },
    {
        id: "12dd2f32",
        name: "James Wilson",
        email: "james@example.com",
        role: "Moderator",
        status: "inactive",
        phone_number: "+1 (555) 234-5678",
        dob: "1985-12-03T00:00:00Z",
        address: "789 Pine Road, Chicago, IL 60601",
        password: "hashed_password_3",
        created_at: "2024-02-01T11:45:00Z",
    },
    {
        id: "953adc1e",
        name: "Emily Davis",
        email: "emily@example.com",
        role: "User",
        status: "active",
        phone_number: "+1 (555) 345-6789",
        dob: "1992-03-25T00:00:00Z",
        address: "321 Elm Street, Boston, MA 02108",
        password: "hashed_password_4",
        created_at: "2024-01-20T09:15:00Z",
    },
    {
        id: "874bef23",
        name: "Michael Brown",
        email: "michael@example.com",
        role: "User",
        status: "active",
        phone_number: "+1 (555) 456-7890",
        dob: "1987-07-12T00:00:00Z",
        address: "654 Cedar Lane, Seattle, WA 98101",
        password: "hashed_password_5",
        created_at: "2024-01-25T16:20:00Z",
    },
    {
        id: "365cfe89",
        name: "Lisa Anderson",
        email: "lisa@example.com",
        role: "User",
        status: "inactive",
        phone_number: "+1 (555) 567-8901",
        dob: "1993-09-08T00:00:00Z",
        address: "987 Maple Drive, Austin, TX 78701",
        password: "hashed_password_6",
        created_at: "2024-02-05T13:45:00Z",
    },
    {
        id: "741def56",
        name: "David Taylor",
        email: "david@example.com",
        role: "Admin",
        status: "active",
        phone_number: "+1 (555) 678-9012",
        dob: "1986-11-30T00:00:00Z",
        address: "147 Birch Street, Denver, CO 80202",
        password: "hashed_password_7",
        created_at: "2024-01-18T10:30:00Z",
    },
    {
        id: "632abc98",
        name: "Rachel White",
        email: "rachel@example.com",
        role: "User",
        status: "active",
        phone_number: "+1 (555) 789-0123",
        dob: "1991-04-17T00:00:00Z",
        address: "258 Willow Ave, Portland, OR 97201",
        password: "hashed_password_8",
        created_at: "2024-02-08T15:10:00Z",
    },
    {
        id: "159ghj45",
        name: "Kevin Martinez",
        email: "kevin@example.com",
        role: "Moderator",
        status: "active",
        phone_number: "+1 (555) 890-1234",
        dob: "1989-02-14T00:00:00Z",
        address: "369 Pine Street, Miami, FL 33101",
        password: "hashed_password_9",
        created_at: "2024-01-30T11:25:00Z",
    },
    {
        id: "987klm32",
        name: "Amanda Clark",
        email: "amanda@example.com",
        role: "User",
        status: "inactive",
        phone_number: "+1 (555) 901-2345",
        dob: "1994-06-22T00:00:00Z",
        address: "741 Oak Road, Phoenix, AZ 85001",
        password: "hashed_password_10",
        created_at: "2024-02-12T14:50:00Z",
    },
];

export function UsersTable() {
    const { toast } = useToast();
    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState({});

    const columns: ColumnDef<UserType>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(!!value)
                    }
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
        },
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
        },
        {
            accessorKey: "email",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Email
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
        },
        {
            accessorKey: "role",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Role
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
        },
        {
            accessorKey: "status",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Status
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const status = row.getValue("status") as string;
                return (
                    <Badge
                        variant={status === "active" ? "success" : "secondary"}
                    >
                        {status}
                    </Badge>
                );
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => {
                                    navigator.clipboard.writeText(user.id);
                                    console.log(user.id);
                                    toast({
                                        title: "Copied ID",
                                        description:
                                            "User ID has been copied to clipboard.",
                                    });
                                }}
                            >
                                <Copy className="mr-2 h-4 w-4" />
                                Copy ID
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setSelectedUser(user)}
                            >
                                <User className="mr-2 h-4 w-4" />
                                View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const table = useReactTable({
        data: mockUsers,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            rowSelection,
        },
        initialState: {
            pagination: {
                pageSize: 5,
            },
        },
    });

    return (
        <>
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
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <div className="border-t p-4">
                    <DataTablePagination table={table} />
                </div>
            </div>
            <UserDetailsModal
                user={selectedUser}
                open={!!selectedUser}
                onClose={() => setSelectedUser(null)}
            />
        </>
    );
}
