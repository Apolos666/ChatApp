import { ColumnDef } from "@tanstack/react-table";
import { User as UserType } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SortableTableHeader } from "../sortable-table-header";
import { UserActionsCell } from "../user-actions-cell";
import { formatDate } from "@/lib/utils";

export const getColumns = ({
    setSelectedUser,
    setIsEditMode,
}: {
    setSelectedUser: (user: UserType) => void;
    setIsEditMode: (isEditMode: boolean) => void;
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
            <SortableTableHeader column={column} title="Name"/>
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
            return <SortableTableHeader column={column} title="Phone Number" />;
        }
    },
    {
        accessorKey: "role",
        header: ({ column }) => (
            <SortableTableHeader column={column} title="Role" />
        ),
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <SortableTableHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return (
                <Badge variant={status === "active" ? "success" : "secondary"}>
                    {status}
                </Badge>
            );
        },
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => (
            <SortableTableHeader column={column} title="Joined At" />
        ),
        cell: ({ row }) => {
            const createdAt = row.getValue("created_at") as string;
            return <span>{formatDate(createdAt)}</span>;
        },
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
            />
        ),
    },
];
