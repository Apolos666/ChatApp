import { Sidebar } from "@/components/admin/dashboard/sidebar"
import { Header } from "@/components/admin/dashboard/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <main className="max-w-7xl mx-auto p-6">
          <Header />
          {children}
        </main>
      </div>
    </div>
  )
}