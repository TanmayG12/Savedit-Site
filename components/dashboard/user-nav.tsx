'use client'

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon, MonitorSmartphone } from "lucide-react"
import { cn } from "@/lib/utils"

export function UserNav() {
    const router = useRouter()
    const supabase = createClient()
    const [user, setUser] = useState<any>(null)
    const { theme, setTheme, systemTheme } = useTheme()
    const effective = theme === "system" ? systemTheme : theme

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        getUser()
    }, [supabase])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    const initials = user?.email?.substring(0, 2).toUpperCase() || "U"

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email} />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">User</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user?.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <div className="px-2 py-3">
                        <div className="text-sm text-muted-foreground mb-2 px-1">Appearance</div>
                        <div className="flex items-center gap-1 rounded-2xl bg-muted/60 p-1.5">
                            {[
                                { label: "Light", value: "light", icon: Sun },
                                { label: "Dark", value: "dark", icon: Moon },
                                { label: "System", value: "system", icon: MonitorSmartphone },
                            ].map((opt) => {
                                const Icon = opt.icon
                                const active = theme === opt.value
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            setTheme(opt.value as "light" | "dark" | "system")
                                        }}
                                        className={cn(
                                            "flex h-9 flex-1 items-center justify-center gap-2 rounded-xl px-3 text-sm font-medium text-muted-foreground transition-all",
                                            active && "bg-background text-foreground shadow-sm"
                                        )}
                                        aria-label={opt.label}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span className="hidden sm:inline">{opt.label}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                    <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
                        Settings
                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
