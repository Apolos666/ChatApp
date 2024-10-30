import { StatCard } from "@/components/admin/dashboard/stat-card";
import { Users, Shield, MessageSquare } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <StatCard
                    title="Total Users"
                    value="1,234"
                    description="+20% from last month"
                    icon={<Users className="h-4 w-4 text-muted-foreground" />}
                />
                <StatCard
                    title="Moderators"
                    value="56"
                    description="4.5% of total users"
                    icon={<Shield className="h-4 w-4 text-muted-foreground" />}
                />
                <StatCard
                    title="Active Chats"
                    value="89"
                    description="+5% from last hour"
                    icon={
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    }
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {/* <UserGrowthChart />
                <ChatActivityChart /> */}
            </div>
        </div>
    );
}
