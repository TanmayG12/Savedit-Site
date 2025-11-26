'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { SavedItemCard } from '@/components/saved-item-card'
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from 'sonner'

type Collection = {
    id: string
    name: string
    item_count?: number
    role?: string
    is_shared?: boolean
}

type SavedItem = {
    id: string
    title: string
    url: string
    thumbnail_url?: string | null
    thumbnail_mirrored_url?: string | null
    created_at?: string
    tags?: string[]
    notes?: string | null
    description?: string | null
    provider?: string
    reminder?: any
}

export default function CollectionDetailPage({ params }: { params: { id: string } }) {
    const [items, setItems] = useState<SavedItem[]>([])
    const [collection, setCollection] = useState<Collection | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        const fetchData = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/login')
                return
            }

            // Authoritative collection access (owned + shared)
            const { data, error } = await supabase.rpc('list_accessible_collections_for_user', {
                p_user_id: session.user.id,
            })

            if (error) {
                console.error('Error fetching accessible collections:', error)
                toast.error('Could not load this collection')
                setLoading(false)
                return
            }

            const found = (data || []).find((c: any) => (c.collection_id ?? c.id) === params.id)

            if (!found) {
                setCollection(null)
                setItems([])
                setLoading(false)
                return
            }

            const mappedCollection: Collection = {
                id: found.collection_id ?? found.id,
                name: found.title ?? found.name ?? 'Untitled',
                item_count: Number(found.item_count ?? 0),
                role: found.role,
                is_shared: found.is_shared,
            }
            setCollection(mappedCollection)

            // Fetch items in the collection via join table.
            // RLS on saved_items ensures we only see items we have access to.
            const { data: itemsData, error: itemsError } = await supabase
                .from('collection_items')
                .select('saved_item_id, saved_items_active!inner(*)')
                .eq('collection_id', params.id)

            if (itemsError) {
                console.error('Error fetching collection items:', itemsError)
                // Fallback: direct column if present
                const { data: directItems, error: directError } = await supabase
                    .from('saved_items_active')
                    .select('*')
                    .eq('collection_id', params.id)
                    .eq('user_id', session.user.id)

                if (directError) {
                    toast.error('Could not load items for this collection')
                } else {
                    setItems((directItems as SavedItem[]) || [])
                }
            } else {
                const mappedItems =
                    itemsData
                        ?.map((i: any) => i.saved_items_active)
                        .filter(Boolean) as SavedItem[] ?? []
                setItems(mappedItems)
            }

            setLoading(false)
        }

        fetchData()
    }, [supabase, router, params.id])

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-9 w-64" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-48 w-full rounded-lg" />
                    ))}
                </div>
            </div>
        )
    }

    if (!collection) {
        return <div className="text-sm text-muted-foreground">Collection not found</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/collections">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">{collection.name}</h1>
            </div>

            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-16 text-center">
                    <div className="text-4xl mb-4">📄</div>
                    <h3 className="text-lg font-semibold mb-2">Empty collection</h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                        This collection has no items yet.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr">
                    {items.map((item) => (
                        <SavedItemCard key={item.id} item={item} />
                    ))}
                </div>
            )}
        </div>
    )
}
