'use client'

import { Sidebar } from "@/components/admin/sidebar"
import { Header } from "@/components/admin/header"
import { usePathname } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if the current path is under /admin/auth
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/admin/signin')

  // If it's an auth page, only render children without dashboard chrome
  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto w-full p-6">
          {children}
        </main>
      </div>
    </div>
  )
}