'use client'

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"

export function CreateCollectionDialog() {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const supabase = createClient()
    const router = useRouter()

    const handleCreate = async () => {
        if (!name.trim()) return

        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            const { error } = await supabase
                .from('collections')
                .insert({ name, owner_id: user.id })

            if (error) {
                console.error('Error creating collection:', error)
            } else {
                setOpen(false)
                setName("")
                router.refresh()
            }
        }
        setLoading(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Collection
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Collection</DialogTitle>
                    <DialogDescription>
                        Create a new collection to organize your saved items.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="col-span-3"
                            placeholder="e.g. Recipes, Articles"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleCreate} disabled={loading}>
                        {loading ? "Creating..." : "Create"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
