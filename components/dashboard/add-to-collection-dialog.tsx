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
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { Check } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface AddToCollectionDialogProps {
    itemId: string
    trigger?: React.ReactNode
    renderTrigger?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

type Collection = {
    id: string
    name: string
    item_count?: number
    role?: string
    is_shared?: boolean
}

export function AddToCollectionDialog({
    itemId,
    trigger,
    renderTrigger = true,
    open: controlledOpen,
    onOpenChange: setControlledOpen,
}: AddToCollectionDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false)
    const open = controlledOpen ?? internalOpen
    const setOpen = setControlledOpen ?? setInternalOpen

    const [collections, setCollections] = useState<Collection[]>([])
    const [loading, setLoading] = useState(false)
    const [memberCollections, setMemberCollections] = useState<Set<string>>(new Set())
    const supabase = createClient()

    useEffect(() => {
        if (!open) return

        const load = async () => {
            setLoading(true)
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                setLoading(false)
                toast.error("You need to be signed in to manage collections.")
                return
            }

            const { data, error } = await supabase.rpc('list_accessible_collections_for_user', {
                p_user_id: user.id,
            })

            if (error) {
                console.error('Error fetching collections via RPC:', error)
                toast.error('Could not load collections. Showing your collections only.')
                const { data: owned, error: ownedError } = await supabase
                    .from('collections')
                    .select('id, name, item_count')
                    .eq('owner_id', user.id)
                    .order('updated_at', { ascending: false })

                if (!ownedError && owned) {
                    setCollections(owned.map((c) => ({
                        id: c.id,
                        name: c.name,
                        item_count: Number(c.item_count ?? 0),
                    })))
                }
            } else {
                setCollections(
                    (data || []).map((c: any) => ({
                        id: c.collection_id ?? c.id,
                        name: c.title ?? c.name ?? 'Untitled',
                        item_count: Number(c.item_count ?? 0),
                        role: c.role,
                        is_shared: c.is_shared,
                    }))
                )
            }

            const { data: inCollections } = await supabase
                .from('collection_items')
                .select('collection_id')
                .eq('saved_item_id', itemId)

            if (inCollections) {
                setMemberCollections(new Set(inCollections.map(c => c.collection_id)))
            }
            setLoading(false)
        }

        void load()
    }, [open, supabase, itemId])

    const fetchCollections = async () => {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            setLoading(false)
            toast.error("You need to be signed in to manage collections.")
            return
        }

        // Fetch all accessible collections (owned + shared) to mirror mobile behavior
        const { data, error } = await supabase.rpc('list_accessible_collections_for_user', {
            p_user_id: user.id,
        })

        if (error) {
            console.error('Error fetching collections via RPC:', error)
            toast.error('Could not load collections. Showing your collections only.')
            const { data: owned, error: ownedError } = await supabase
                .from('collections')
                .select('id, name, item_count')
                .eq('owner_id', user.id)
                .order('updated_at', { ascending: false })

            if (!ownedError && owned) {
                setCollections(owned.map((c) => ({
                    id: c.id,
                    name: c.name,
                    item_count: Number(c.item_count ?? 0),
                })))
            }
        } else {
            setCollections(
                (data || []).map((c: any) => ({
                    id: c.collection_id ?? c.id,
                    name: c.title ?? c.name ?? 'Untitled',
                    item_count: Number(c.item_count ?? 0),
                    role: c.role,
                    is_shared: c.is_shared,
                }))
            )
        }

        // Fetch collections this item is already in
        const { data: inCollections } = await supabase
            .from('collection_items')
            .select('collection_id')
            .eq('saved_item_id', itemId)

        if (inCollections) {
            setMemberCollections(new Set(inCollections.map(c => c.collection_id)))
        }
        setLoading(false)
    }

    const toggleCollection = async (collectionId: string) => {
        const isMember = memberCollections.has(collectionId)

        if (isMember) {
            // Remove
            const { error } = await supabase
                .from('collection_items')
                .delete()
                .match({ collection_id: collectionId, saved_item_id: itemId })

            if (error) {
                toast.error("Failed to remove from collection")
            } else {
                const next = new Set(memberCollections)
                next.delete(collectionId)
                setMemberCollections(next)
                toast.success("Removed from collection")
            }
        } else {
            // Add
            const { error } = await supabase
                .from('collection_items')
                .insert({ collection_id: collectionId, saved_item_id: itemId })

            if (error) {
                toast.error("Failed to add to collection")
            } else {
                const next = new Set(memberCollections)
                next.add(collectionId)
                setMemberCollections(next)
                toast.success("Added to collection")
            }
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {renderTrigger ? (
                <DialogTrigger asChild>
                    {trigger || <Button variant="outline" size="sm">Add to Collection</Button>}
                </DialogTrigger>
            ) : null}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add to Collection</DialogTitle>
                    <DialogDescription>
                        Select collections to add this item to.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-2 py-4 max-h-[300px] overflow-y-auto">
                    {loading ? (
                        <div className="text-center text-sm text-muted-foreground">Loading collections...</div>
                    ) : collections.length === 0 ? (
                        <div className="text-center text-sm text-muted-foreground">No collections found.</div>
                    ) : (
                        collections.map((collection) => {
                            const isSelected = memberCollections.has(collection.id)
                            return (
                                <div
                                    key={collection.id}
                                    className={cn(
                                        "flex items-center justify-between p-3 rounded-md border cursor-pointer transition-colors hover:bg-accent",
                                        isSelected && "bg-accent border-primary/50"
                                    )}
                                    onClick={() => toggleCollection(collection.id)}
                                >
                                    <div className="flex flex-col">
                                        <span className="font-medium text-sm">{collection.name}</span>
                                        <span className="text-xs text-muted-foreground">{collection.item_count || 0} items</span>
                                    </div>
                                    {isSelected && <Check className="h-4 w-4 text-primary" />}
                                </div>
                            )
                        })
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Done</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
