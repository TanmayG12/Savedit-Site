/* eslint-disable @next/next/no-img-element */
import { ExternalLink, FolderPlus, Bell, Check } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SynthFallback } from "./synth-fallback"
import { AddToCollectionDialog } from "@/components/dashboard/add-to-collection-dialog"
import { CreateReminderDialog } from "@/components/dashboard/create-reminder-dialog"
import { ItemDetailSheet } from "@/components/dashboard/item-detail-sheet"
import { useState } from "react"
import { createClient } from "@/lib/supabase"
import { toast } from "sonner"

interface SavedItem {
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
    shared_with_count?: number
    shared_with_you?: boolean
    is_shared?: boolean
    owner_display_name?: string | null
    owner_username?: string | null
}

export function SavedItemCard({ item: initialItem, onDelete, onUpdate }: { 
    item: SavedItem
    onDelete?: () => void
    onUpdate?: (item: SavedItem) => void
}) {
    const [item, setItem] = useState(initialItem)
    const thumbnailUrl = item.thumbnail_mirrored_url || item.thumbnail_url
    const [showCollectionDialog, setShowCollectionDialog] = useState(false)
    const [showReminderDialog, setShowReminderDialog] = useState(false)
    const [showDetailSheet, setShowDetailSheet] = useState(false)
    const supabase = createClient()

    const handleCompleteReminder = async () => {
        if (!item.reminder) return

        const { error } = await supabase
            .from('reminders')
            .update({ status: 'completed' })
            .eq('id', item.reminder.id)

        if (error) {
            toast.error("Failed to complete reminder")
        } else {
            toast.success("Reminder completed")
            // Ideally we'd refresh the page or update local state here
            window.location.reload()
        }
    }

    const hostname = (() => {
        try {
            return new URL(item.url).hostname.replace('www.', '')
        } catch {
            return item.url
        }
    })()

    const faviconUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`

    const sharedLabel = (() => {
        if (item.shared_with_you) return 'Shared with you'
        if (item.shared_with_count && item.shared_with_count > 0) {
            return item.shared_with_count === 1
                ? 'Shared with 1 other'
                : `Shared with ${item.shared_with_count} others`
        }
        if (item.is_shared) return 'Shared'
        return null
    })()

    const reminderLabel = (() => {
        const fireAt = item.reminder?.fire_at_utc || item.reminder?.fire_at
        if (!fireAt) return 'Reminder'
        const date = new Date(fireAt)
        return `Reminder • ${date.toLocaleDateString()}`
    })()

    const providerLabel = item.provider || hostname

    const openDetailSheet = () => {
        setShowDetailSheet(true)
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            openDetailSheet()
        }
    }

    const handleItemUpdate = (updatedItem: SavedItem) => {
        setItem(updatedItem)
        onUpdate?.(updatedItem)
    }

    const handleItemDelete = () => {
        onDelete?.()
        // Refresh the page to remove the deleted item
        window.location.reload()
    }

    return (
        <>
        <Card
            className="group flex h-full flex-col overflow-hidden border-border/70 bg-card/90 backdrop-blur-md transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] cursor-pointer"
            onClick={openDetailSheet}
            role="button"
            tabIndex={0}
            onKeyDown={handleKeyPress}
            draggable
            onDragStart={(e) => {
                e.dataTransfer.setData("text/savedItemId", item.id)
                e.dataTransfer.effectAllowed = "copyMove"
            }}
        >
            {/* Media with platform pill */}
            <div className="relative aspect-square sm:aspect-[16/10] w-full overflow-hidden bg-muted/40">
                {thumbnailUrl && typeof thumbnailUrl === 'string' ? (
                    <img
                        src={thumbnailUrl}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            const fallback = e.currentTarget.nextElementSibling as HTMLElement
                            if (fallback) fallback.style.display = 'flex'
                        }}
                    />
                ) : null}
                <div className={thumbnailUrl ? "hidden" : "flex"} style={{ width: '100%', height: '100%' }}>
                    <SynthFallback
                        providerDomain={hostname}
                        title={item.title}
                        itemType={item.provider}
                    />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent dark:from-background/70 dark:via-background/30" />

                <div className="absolute top-2 left-2 right-2 sm:top-3 sm:left-3 sm:right-3 flex items-start justify-between gap-1 sm:gap-2">
                    <Badge
                        variant="outline"
                        className="flex h-6 sm:h-7 items-center gap-1 sm:gap-1.5 rounded-full bg-background/85 backdrop-blur px-2 sm:px-2.5 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide border-border/60"
                    >
                        <img
                            src={faviconUrl}
                            alt=""
                            className="h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full"
                            onError={(e) => e.currentTarget.style.display = 'none'}
                        />
                        <span className="truncate max-w-[60px] sm:max-w-none">{providerLabel}</span>
                    </Badge>
                    {item.reminder && (
                        <Badge variant="secondary" className="hidden sm:flex h-8 items-center gap-1 rounded-full bg-amber-500/90 text-amber-950 px-3 text-[11px] font-semibold">
                            <Bell className="h-3.5 w-3.5" />
                            {reminderLabel}
                        </Badge>
                    )}
                </div>
            </div>

            <div className="flex flex-col flex-grow">
                <CardContent className="px-2 py-2 sm:px-4 sm:py-3 space-y-1 sm:space-y-3 flex-grow">
                    <div className="flex flex-col gap-0.5 sm:gap-1">
                        <p className="text-xs sm:text-base font-semibold text-foreground leading-snug line-clamp-2">
                            {item.title || 'Untitled'}
                        </p>
                        {item.owner_display_name && (
                            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                                by {item.owner_display_name}
                            </p>
                        )}
                    </div>

                    {sharedLabel && (
                        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="h-2 w-2 rounded-full bg-primary/70" />
                            <span className="truncate">{sharedLabel}</span>
                        </div>
                    )}

                    {item.tags && item.tags.length > 0 && (
                        <div className="hidden sm:flex flex-wrap gap-2">
                            {item.tags.slice(0, 3).map((tag, idx) => (
                                <Badge key={idx} variant="secondary" className="text-[11px] px-2.5 py-1 rounded-full bg-secondary/70">
                                    {tag}
                                </Badge>
                            ))}
                            {item.tags.length > 3 && (
                                <Badge variant="outline" className="text-[11px] px-2.5 py-1 rounded-full">
                                    +{item.tags.length - 3}
                                </Badge>
                            )}
                        </div>
                    )}

                    {item.notes && (
                        <p className="hidden sm:block text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                            {item.notes}
                        </p>
                    )}
                </CardContent>

                <CardFooter className="p-2 sm:p-4 pt-0 mt-auto flex items-center gap-1 sm:gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 h-7 sm:h-9 text-xs sm:text-sm justify-center rounded-full border border-border/60 bg-background/70 backdrop-blur transition-colors hover:bg-primary hover:text-primary-foreground"
                        asChild
                        onClick={(e) => e.stopPropagation()}
                    >
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                            <span className="hidden sm:inline">Open</span>
                        </a>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 sm:h-9 sm:w-9 rounded-full border border-border/60 bg-background/70 backdrop-blur"
                        onClick={(e) => {
                            e.stopPropagation()
                            setShowCollectionDialog(true)
                        }}
                        aria-label="Add to Collection"
                    >
                        <FolderPlus className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    {item.reminder ? (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 sm:h-9 sm:w-9 rounded-full border border-emerald-500/50 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                            onClick={(e) => {
                                e.stopPropagation()
                                handleCompleteReminder()
                            }}
                            title="Complete Reminder"
                        >
                            <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="sr-only">Complete Reminder</span>
                        </Button>
                    ) : (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 sm:h-9 sm:w-9 rounded-full border border-border/60 bg-background/70 backdrop-blur"
                            onClick={(e) => {
                                e.stopPropagation()
                                setShowReminderDialog(true)
                            }}
                            aria-label="Set Reminder"
                        >
                            <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                    )}
                </CardFooter>
            </div>
        </Card>

        <ItemDetailSheet
            item={item}
            open={showDetailSheet}
            onOpenChange={setShowDetailSheet}
            onDelete={handleItemDelete}
            onUpdate={handleItemUpdate}
        />

        <AddToCollectionDialog
            itemId={item.id}
            renderTrigger={false}
            open={showCollectionDialog}
            onOpenChange={setShowCollectionDialog}
        />
        <CreateReminderDialog
            itemId={item.id}
            renderTrigger={false}
            open={showReminderDialog}
            onOpenChange={setShowReminderDialog}
        />
        </>
    )
}
