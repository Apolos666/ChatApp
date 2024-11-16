"use client";

import { Spinner } from "@/components/admin/shared/spinner";
import { UsersTable } from "@/components/admin/users/table/users-table";
import { useAuthCheck } from "@/hooks/use-auth-check";
export default function UsersPage() {
    const { isChecking } = useAuthCheck()

  if (isChecking) return <Spinner size="lg" text="Loading..." className="justify-center mt-10"/>
    return (
        <div className="space-y-4">
            <UsersTable />
        </div>
    );
}