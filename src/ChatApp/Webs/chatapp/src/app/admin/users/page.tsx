"use client";

import { UsersTable } from "@/components/admin/users/users-table";
import { UsersToolbar } from "@/components/admin/users/users-toolbar";

export default function UsersPage() {
    return (
        <div className="space-y-4">
            <UsersToolbar />
            <UsersTable />
        </div>
    );
}