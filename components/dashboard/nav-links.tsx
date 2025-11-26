'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Home, Bell, FolderOpen } from "lucide-react"

interface NavProps extends React.HTMLAttributes<HTMLElement> {
    setOpen?: (open: boolean) => void
}

export function NavLinks({ className, setOpen, ...props }: NavProps) {
    const pathname = usePathname()

    const links = [
        {
            href: "/dashboard",
            label: "Home",
            icon: Home,
            active: pathname === "/dashboard",
        },
        {
            href: "/dashboard/collections",
            label: "Collections",
            icon: FolderOpen,
            active: pathname?.startsWith("/dashboard/collections"),
        },
        {
            href: "/dashboard/reminders",
            label: "Reminders",
            icon: Bell,
            active: pathname?.startsWith("/dashboard/reminders"),
        },
    ]

    return (
        <nav className={cn("flex flex-col space-y-1", className)} {...props}>
            {links.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => {
                        if (setOpen) setOpen(false)
                    }}
                    className={cn(
                        buttonVariants({ variant: link.active ? "secondary" : "ghost" }),
                        "justify-start",
                        link.active && "bg-secondary"
                    )}
                >
                    <link.icon className="mr-2 h-4 w-4" />
                    {link.label}
                </Link>
            ))}
        </nav>
    )
}
