import { Sidebar } from "@/components/dashboard/sidebar"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { UserNav } from "@/components/dashboard/user-nav"
import { QuickSaveFloating } from "@/components/dashboard/quicksave-floating"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 border-b md:hidden">
                <MobileNav />
                <div className="font-semibold">Savedit</div>
                <UserNav />
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden h-screen w-72 shrink-0 border-r bg-background md:sticky md:top-0 md:flex md:flex-col">
                <div className="flex h-full flex-col">
                    <Sidebar className="flex-1" />
                    <div className="p-4 border-t">
                        <UserNav />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="h-full px-4 py-6 lg:px-8">
                    {children}
                </div>
            </main>

            <QuickSaveFloating />
        </div>
    )
}
