"use client";

import Loading from "@/app/(auth)/loading";
import { UsersTable } from "@/components/admin/users/table/users-table";
import { useAuthCheck } from "@/hooks/use-auth-check";
export default function UsersPage() {
    const { isChecking } = useAuthCheck()

  if (isChecking) return <Loading />
    return (
        <div className="space-y-4">
            <UsersTable />
        </div>
    );
}