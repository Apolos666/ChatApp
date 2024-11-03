import { ColumnDef } from "@tanstack/react-table";
import { User as UserType } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SortableTableHeader } from "./sortable-table-header";
import { UserActionsCell } from "./user-actions-cell";
import { formatDate } from "@/lib/utils";

const multiValueFilter = (row: any, columnId: string, filterValue: string) => {
    const cellValue = row.getValue(columnId);
    return Array.isArray(filterValue) ? filterValue.includes(cellValue) : cellValue === filterValue;
};

export const getColumns = ({
    setSelectedUser,
    setIsEditMode,
    handleDelete,
}: {
    setSelectedUser: (user: UserType) => void;
    setIsEditMode: (isEditMode: boolean) => void;
    handleDelete: (ids: string[]) => void;
}): ColumnDef<UserType>[] => [
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
        header: ({ column }) => (
            <SortableTableHeader column={column} title="Name" />
        ),
        cell: ({ row }) => {
            const user = row.original;
            return (
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage
                            src={user.avatar || ""}
                            alt={user.name}
                            className="object-cover"
                        />
                        <AvatarFallback>
                            {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{user.name}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <SortableTableHeader column={column} title="Email" />
        ),
    },
    {
        accessorKey: "phone_number",
        header: ({ column }) => {
            return (
                <SortableTableHeader
                    column={column}
                    title="Phone Number"
                    align="center"
                />
            );
        },
        cell: ({ row }) => {
            const phoneNumber = row.getValue("phone_number") as string;
            return <div className="text-center">{phoneNumber}</div>;
        },
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => (
            <SortableTableHeader
                column={column}
                title="Joined At"
                align="center"
            />
        ),
        cell: ({ row }) => {
            const createdAt = row.getValue("created_at") as string;
            return <div className="text-center">{formatDate(createdAt)}</div>;
        },
    },
    {
        accessorKey: "role",
        header: ({ column }) => (
            <SortableTableHeader column={column} title="Role" align="center" />
        ),
        cell: ({ row }) => (
            <div className="text-center">{row.getValue("role")}</div>
        ),
        filterFn: multiValueFilter,
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <SortableTableHeader
                column={column}
                title="Status"
                align="center"
            />
        ),
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return (
                <div className="text-center">
                    <Badge
                        variant={status === "active" ? "success" : "secondary"}
                    >
                        {status}
                    </Badge>
                </div>
            );
        },
        filterFn: multiValueFilter,
    },
    {
        id: "actions",
        cell: ({ row }) => (
            <UserActionsCell
                user={row.original}
                onView={(user) => setSelectedUser(user)}
                onEdit={(user) => {
                    setSelectedUser(user);
                    setIsEditMode(true);
                }}
                onDelete={(user) => {
                    handleDelete([user.id]);
                }}
            />
        ),
    },
];
