'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

// Force dynamic rendering to avoid Supabase client initialization during build
export const dynamic = 'force-dynamic'
import { CollectionCard } from '@/components/dashboard/collection-card'
import { CreateCollectionDialog } from '@/components/dashboard/create-collection-dialog'
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

type Collection = {
    id: string
    name: string
    item_count: number
    created_at?: string
    updated_at?: string
    role?: string
    is_shared?: boolean
    sample_thumbnails?: string[]
}

export default function CollectionsPage() {
    const [collections, setCollections] = useState<Collection[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        const fetchCollections = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/login')
                return
            }

            // Use the same RPC as mobile to include owned + shared collections.
            const { data, error } = await supabase.rpc('list_accessible_collections_for_user', {
                p_user_id: session.user.id,
            })

            if (error) {
                console.error('Error fetching collections via RPC:', error)
                toast.error('Could not load collections. Retrying with fallback.')
                // Fallback: owned collections only
                const { data: owned, error: ownedError } = await supabase
                    .from('collections')
                    .select('id, name, item_count, created_at, updated_at')
                    .eq('owner_id', session.user.id)
                    .order('updated_at', { ascending: false })

                if (ownedError) {
                    console.error('Error fetching owned collections:', ownedError)
                } else {
                    setCollections(
                        (owned || []).map((c) => ({
                            id: c.id,
                            name: c.name,
                            item_count: Number(c.item_count ?? 0),
                            created_at: c.created_at ?? undefined,
                            updated_at: c.updated_at ?? undefined,
                        }))
                    )
                }
                setLoading(false)
                return
            }

            const mapped: Collection[] = (data || []).map((c: any) => ({
                id: c.collection_id ?? c.id,
                name: c.title ?? c.name ?? 'Untitled',
                item_count: Number(c.item_count ?? 0),
                created_at: c.created_at ?? undefined,
                updated_at: c.updated_at ?? undefined,
                role: c.role,
                is_shared: c.is_shared,
                sample_thumbnails: Array.isArray(c.sample_thumbnails) ? c.sample_thumbnails : c.samples ?? [],
            }))

            setCollections(mapped)
            setLoading(false)
        }

        fetchCollections()
    }, [supabase, router])

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-9 w-48" />
                    <Skeleton className="h-9 w-32" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-32 w-full rounded-lg" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Collections</h1>
                <CreateCollectionDialog />
            </div>

            {collections.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-16 text-center">
                    <div className="text-4xl mb-4">📂</div>
                    <h3 className="text-lg font-semibold mb-2">No collections yet</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mb-4">
                        Create a collection to organize your saved items.
                    </p>
                    <CreateCollectionDialog />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {collections.map((collection) => (
                        <CollectionCard key={collection.id} collection={collection} />
                    ))}
                </div>
            )}
        </div>
    )
}
