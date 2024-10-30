"use client";

import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    Users,
    MessageSquare,
    Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarLinks = [
    {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Users",
        href: "/admin/users",
        icon: Users,
    },
    {
        title: "Rooms",
        href: "/admin/rooms",
        icon: MessageSquare,
    },
    {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 border-r min-h-screen p-4">
            <div className="font-bold text-xl mb-8">Chat App</div>
            <nav className="space-y-2">
                {sidebarLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                        <Button
                            variant={
                                pathname === link.href ? "secondary" : "ghost"
                            }
                            className="w-full justify-start"
                        >
                            <link.icon className="mr-2 h-4 w-4" />
                            {link.title}
                        </Button>
                    </Link>
                ))}
            </nav>
        </div>
    );
}
