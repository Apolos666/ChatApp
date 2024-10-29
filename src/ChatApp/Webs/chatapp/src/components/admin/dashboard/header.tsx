"use client";

import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";

export function Header() {
    const pathname = usePathname();
    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Convert pathname to readable title
    const getPageTitle = (path: string) => {
        const segments = path.split('/');
        const lastSegment = segments[segments.length - 1];
        return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
    };

    return (
        <div className="max-w-7xl mx-auto border-b mb-8">
            <div className="flex h-16 items-center px-4 justify-between">
                <div>
                    <h1 className="text-2xl font-bold">{getPageTitle(pathname)}</h1>
                    <p className="text-sm text-muted-foreground">{currentDate}</p>
                </div>
                <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}
