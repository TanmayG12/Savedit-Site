'use client'

import { useEffect, useMemo, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { cn } from "@/lib/utils"
import { NavLinks } from "./nav-links"
import { buttonVariants } from "@/components/ui/button"
import { FolderOpen, Loader2, ChevronDown } from "lucide-react"
import { toast } from "sonner"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

type CollectionNav = {
    id: string
    name: string
    item_count?: number
}

export function Sidebar({ className }: SidebarProps) {
    const [collections, setCollections] = useState<CollectionNav[]>([])
    const [collectionsOpen, setCollectionsOpen] = useState(true)
    const [loadingCollections, setLoadingCollections] = useState(false)
    const supabase = useMemo(() => createClient(), [])
    const pathname = usePathname()
    const router = useRouter()

    useEffect(() => {
        const loadCollections = async () => {
            setLoadingCollections(true)
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                setLoadingCollections(false)
                return
            }

            const { data, error } = await supabase.rpc('list_accessible_collections_for_user', {
                p_user_id: session.user.id,
            })

            if (error) {
                console.error('Error fetching collections via RPC:', error)
                toast.error('Could not load collections')
                setLoadingCollections(false)
                return
            }

            const mapped = (data || []).map((c: any) => ({
                id: c.collection_id ?? c.id,
                name: c.title ?? c.name ?? 'Untitled',
                item_count: Number(c.item_count ?? 0),
            }))
            setCollections(mapped)
            setLoadingCollections(false)
        }

        void loadCollections()
    }, [supabase])

    const handleDropToCollection = async (e: React.DragEvent<HTMLButtonElement>, collectionId: string) => {
        e.preventDefault()
        const itemId = e.dataTransfer.getData("text/savedItemId")
        if (!itemId) return

        const { error } = await supabase
            .from('collection_items')
            .upsert(
                { collection_id: collectionId, saved_item_id: itemId },
                { onConflict: 'collection_id,saved_item_id', ignoreDuplicates: true }
            )

        if (error) {
            toast.error("Could not add to collection")
        } else {
            toast.success("Added to collection")
        }
    }

    return (
        <div className={cn("h-full", className)}>
            <div className="sticky top-0 flex h-full flex-col gap-4 px-4 py-6">
                <div className="text-lg font-semibold tracking-tight">Savedit</div>

                <div className="space-y-2">
                    <NavLinks />

                    <div className="space-y-1">
                        <button
                            className={cn(
                                buttonVariants({
                                    variant: pathname?.startsWith("/dashboard/collections") ? "secondary" : "ghost",
                                }),
                                "w-full justify-between"
                            )}
                            onClick={() => setCollectionsOpen((v) => !v)}
                        >
                            <span className="flex items-center gap-2">
                                <FolderOpen className="h-4 w-4" />
                                Collections
                            </span>
                            <span className="flex items-center gap-2">
                                {loadingCollections && <Loader2 className="h-4 w-4 animate-spin" />}
                                <ChevronDown
                                    className={cn(
                                        "h-4 w-4 transition-transform",
                                        collectionsOpen ? "rotate-180" : "rotate-0"
                                    )}
                                />
                            </span>
                        </button>
                        {collectionsOpen && (
                            <div className="space-y-1 pl-6">
                                {(collections || []).slice(0, 8).map((c) => {
                                    const active = pathname?.startsWith(`/dashboard/collections/${c.id}`)
                                    return (
                                        <button
                                            key={c.id}
                                            onClick={() => router.push(`/dashboard/collections/${c.id}`)}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={(e) => handleDropToCollection(e, c.id)}
                                            className={cn(
                                                "flex w-full items-center justify-between rounded-xl px-2 py-2 text-sm transition hover:bg-accent",
                                                active && "bg-accent font-semibold"
                                            )}
                                        >
                                            <span className="truncate">{c.name}</span>
                                            <span className="text-xs text-muted-foreground">{c.item_count ?? 0}</span>
                                        </button>
                                    )
                                })}
                                {!loadingCollections && collections.length === 0 && (
                                    <div className="text-xs text-muted-foreground py-2">No collections yet.</div>
                                )}
                                <button
                                    onClick={() => router.push('/dashboard/collections')}
                                    className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-sm text-muted-foreground transition hover:bg-accent"
                                >
                                    <FolderOpen className="h-4 w-4" />
                                    Manage collections
                                </button>
                            </div>
                        )}
                    </div>

                </div>

            </div>
        </div>
    )
}
