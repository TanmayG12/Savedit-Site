'use client'

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { NavLinks } from "./nav-links"
import { useState } from "react"

export function MobileNav() {
    const [open, setOpen] = useState(false)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
                <div className="px-7">
                    <div className="mb-4 text-lg font-semibold tracking-tight">
                        Savedit
                    </div>
                    <NavLinks setOpen={setOpen} />
                </div>
            </SheetContent>
        </Sheet>
    )
}
