'use client'

// Force dynamic rendering to avoid Supabase client initialization during build
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { SavedItemCard } from '@/components/saved-item-card'
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from 'next/navigation'
import { Bell } from "lucide-react"

export default function RemindersPage() {
    const [items, setItems] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const fetchReminders = async () => {
            const supabase = createClient()
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/login')
                return
            }

            // Fetch active/pending reminders from the 'reminders' table
            const { data, error } = await supabase
                .from('reminders')
                .select(`
                    *,
                    saved_items (*)
                `)
                .eq('user_id', session.user.id)
                .in('status', ['pending', 'active'])
                .order('fire_at_utc', { ascending: true })

            if (error) {
                console.error('Error fetching reminders:', error)
            } else {
                // Map reminders to saved items structure for the card, or create a specific ReminderCard
                // For now, we'll extract the saved_item and attach reminder info
                const mappedItems = data?.map((r: any) => ({
                    ...r.saved_items,
                    reminder: r
                })).filter((i: any) => i.id) || [] // Filter out null saved_items
                setItems(mappedItems)
            }
            setLoading(false)
        }

        fetchReminders()
    }, [router])

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-9 w-48" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-48 w-full rounded-lg" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Reminders</h1>
            </div>

            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-16 text-center">
                    <div className="text-4xl mb-4">🔔</div>
                    <h3 className="text-lg font-semibold mb-2">No reminders</h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                        You don&apos;t have any active reminders.
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
