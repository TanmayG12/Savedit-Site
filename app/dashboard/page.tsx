'use client'

// Force dynamic rendering to avoid Supabase client initialization during build
export const dynamic = 'force-dynamic'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase'
import { SavedItemCard } from '@/components/saved-item-card'
import { useRouter } from 'next/navigation'
import { Skeleton } from "@/components/ui/skeleton"
import { Toolbar } from "@/components/dashboard/toolbar"

export default function DashboardPage() {
    const [items, setItems] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [sort, setSort] = useState('newest')

    const router = useRouter()

    useEffect(() => {
        const fetchItems = async () => {
            const supabase = createClient()
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                router.push('/login')
                return
            }

            // Check if user needs to complete profile
            const { data: profile } = await supabase
                .from('profiles')
                .select('onboarding_done')
                .eq('user_id', session.user.id)
                .single()

            if (profile && !profile.onboarding_done) {
                router.push('/dashboard/complete-profile')
                return
            }

            // Fetch all items with descriptions from the active view
            const { data, error } = await supabase
                .from('saved_items_active')
                .select('*, collection_items(collection_id)')
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error fetching items:', error)
                // Fallback without collection filter
                const { data: fallbackData } = await supabase
                    .from('saved_items_active')
                    .select('*')
                    .order('created_at', { ascending: false })
                setItems(fallbackData || [])
            } else {
                // Filter out items that belong to any collection
                const uncategorizedItems = (data || []).filter(
                    (item: any) => !item.collection_items || item.collection_items.length === 0
                )
                setItems(uncategorizedItems)
            }
            setLoading(false)
        }

        fetchItems()
    }, [router])

    const filteredItems = useMemo(() => {
        let result = [...items]

        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(item =>
                (item.title && item.title.toLowerCase().includes(query)) ||
                (item.url && item.url.toLowerCase().includes(query)) ||
                (item.notes && item.notes.toLowerCase().includes(query))
            )
        }

        if (sort === 'newest') {
            result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        } else if (sort === 'oldest') {
            result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        } else if (sort === 'title') {
            result.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
        }

        return result
    }, [items, searchQuery, sort])

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-9 w-64" />
                    <Skeleton className="h-9 w-24" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="flex flex-col space-y-3">
                            <Skeleton className="h-48 w-full rounded-lg" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Saved Items</h1>
                    <p className="text-muted-foreground">
                        {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
                    </p>
                </div>
            </div>

            <Toolbar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                viewMode={viewMode}
                setViewMode={setViewMode}
                sort={sort}
                setSort={setSort}
            />

            {filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-16 text-center">
                    <div className="text-4xl mb-4">📌</div>
                    <h3 className="text-lg font-semibold mb-2">
                        No items found
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                        {searchQuery ? "Try adjusting your search query." : "Start saving your favorite content using the mobile app or browser extension."}
                    </p>
                </div>
            ) : (
                <div className={viewMode === 'grid'
                    ? "grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr"
                    : "flex flex-col gap-4"
                }>
                    {filteredItems.map((item) => (
                        <div key={item.id} className={viewMode === 'list' ? "w-full" : ""}>
                            <SavedItemCard item={item} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
