'use client'

/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { toast } from 'sonner'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    ExternalLink,
    FolderPlus,
    Bell,
    Trash2,
    Loader2,
    Copy,
    Check,
    X,
    Calendar,
    ArrowLeft,
} from 'lucide-react'
import { AddToCollectionDialog } from './add-to-collection-dialog'
import { CreateReminderDialog } from './create-reminder-dialog'
import { SynthFallback } from '@/components/synth-fallback'

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
}

interface ItemDetailSheetProps {
    item: SavedItem | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onDelete?: () => void
    onUpdate?: (updatedItem: SavedItem) => void
}

export function ItemDetailSheet({
    item,
    open,
    onOpenChange,
    onDelete,
    onUpdate,
}: ItemDetailSheetProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [title, setTitle] = useState('')
    const [notes, setNotes] = useState('')
    const [tagsInput, setTagsInput] = useState('')
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [copied, setCopied] = useState(false)
    const [showCollectionDialog, setShowCollectionDialog] = useState(false)
    const [showReminderDialog, setShowReminderDialog] = useState(false)

    const supabase = createClient()

    // Reset form when item changes
    useEffect(() => {
        if (item) {
            setTitle(item.title || '')
            setNotes(item.notes || '')
            setTagsInput(item.tags?.join(', ') || '')
            setIsEditing(false)
        }
    }, [item])

    if (!item) return null

    const thumbnailUrl = item.thumbnail_mirrored_url || item.thumbnail_url
    const hostname = (() => {
        try {
            return new URL(item.url).hostname.replace('www.', '')
        } catch {
            return item.url
        }
    })()
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`

    const handleCopyUrl = async () => {
        await navigator.clipboard.writeText(item.url)
        setCopied(true)
        toast.success('Link copied')
        setTimeout(() => setCopied(false), 2000)
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const parsedTags = tagsInput
                .split(',')
                .map(t => t.trim())
                .filter(t => t.length > 0)

            const updateData: Record<string, unknown> = {
                notes: notes.trim() || null,
                tags: parsedTags.length > 0 ? parsedTags : [],
            }
            
            // Only update title if it was changed
            if (title.trim() !== item.title) {
                updateData.title = title.trim() || null
            }

            const { error } = await supabase
                .from('saved_items')
                .update(updateData)
                .eq('id', item.id)

            if (error) {
                console.error('Update error:', error)
                // Provide more specific error message
                if (error.code === '42501') {
                    toast.error('You do not have permission to edit this item')
                } else if (error.message) {
                    toast.error(`Failed to save: ${error.message}`)
                } else {
                    toast.error('Failed to save changes')
                }
            } else {
                toast.success('Changes saved')
                setIsEditing(false)
                onUpdate?.({
                    ...item,
                    title: title.trim() || item.title,
                    notes: notes.trim() || null,
                    tags: parsedTags.length > 0 ? parsedTags : undefined,
                })
            }
        } catch (err) {
            toast.error('Failed to save changes')
            console.error(err)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm('Delete this item? This cannot be undone.')) return

        setDeleting(true)
        try {
            const { error } = await supabase
                .from('saved_items')
                .delete()
                .eq('id', item.id)

            if (error) {
                toast.error('Failed to delete')
                console.error(error)
            } else {
                toast.success('Item deleted')
                onOpenChange(false)
                onDelete?.()
            }
        } catch (err) {
            toast.error('Failed to delete')
            console.error(err)
        } finally {
            setDeleting(false)
        }
    }

    const handleCompleteReminder = async () => {
        if (!item.reminder) return

        const { error } = await supabase
            .from('reminders')
            .update({ status: 'completed' })
            .eq('id', item.reminder.id)

        if (error) {
            toast.error('Failed to complete reminder')
        } else {
            toast.success('Reminder completed')
            onUpdate?.({ ...item, reminder: undefined })
        }
    }

    const createdDate = item.created_at
        ? new Date(item.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
        : null

    const reminderDate = item.reminder?.fire_at_utc || item.reminder?.fire_at
        ? new Date(item.reminder.fire_at_utc || item.reminder.fire_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        })
        : null

    return (
        <>
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
                    <SheetHeader className="sr-only">
                        <SheetTitle>Item Details</SheetTitle>
                        <SheetDescription>View and edit saved item details</SheetDescription>
                    </SheetHeader>

                    {/* Thumbnail */}
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted/40 -mx-6 -mt-6 mb-4" style={{ width: 'calc(100% + 48px)' }}>
                        {thumbnailUrl ? (
                            <img
                                src={thumbnailUrl}
                                alt={item.title}
                                className="h-full w-full object-cover"
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

                        {/* Back button */}
                        <Button
                            variant="secondary"
                            size="icon"
                            className="absolute top-4 right-4 h-8 w-8 rounded-full bg-background/90 backdrop-blur hover:bg-background"
                            onClick={() => onOpenChange(false)}
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </Button>

                        {/* Platform badge */}
                        <div className="absolute top-4 left-4">
                            <Badge variant="outline" className="flex h-8 items-center gap-2 rounded-full bg-background/90 backdrop-blur px-3 text-xs font-medium border-border/60">
                                <img src={faviconUrl} alt="" className="h-4 w-4 rounded-full" onError={(e) => e.currentTarget.style.display = 'none'} />
                                {item.provider || hostname}
                            </Badge>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-6 pt-2">
                        {/* Title */}
                        {isEditing ? (
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Add a title..."
                                />
                            </div>
                        ) : (
                            <h2 className="text-xl font-semibold leading-tight">
                                {item.title || 'Untitled'}
                            </h2>
                        )}

                        {/* URL */}
                        <div className="flex items-center gap-2">
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 text-sm text-muted-foreground hover:text-foreground truncate underline-offset-4 hover:underline"
                            >
                                {item.url}
                            </a>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 shrink-0"
                                onClick={handleCopyUrl}
                            >
                                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            </Button>
                        </div>

                        {/* Description - auto-fetched from page metadata */}
                        {item.description && (
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {item.description}
                            </p>
                        )}

                        <Separator />

                        {/* Notes */}
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            {isEditing ? (
                                <Textarea
                                    id="notes"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Add your thoughts..."
                                    rows={4}
                                />
                            ) : (
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {item.notes || 'No notes yet. Tap Edit to add your thoughts.'}
                                </p>
                            )}
                        </div>

                        {/* Tags */}
                        <div className="space-y-2">
                            <Label htmlFor="tags">Tags</Label>
                            {isEditing ? (
                                <Input
                                    id="tags"
                                    value={tagsInput}
                                    onChange={(e) => setTagsInput(e.target.value)}
                                    placeholder="recipe, cooking, italian (comma separated)"
                                />
                            ) : item.tags && item.tags.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {item.tags.map((tag, idx) => (
                                        <Badge key={idx} variant="secondary" className="rounded-full">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No tags</p>
                            )}
                        </div>

                        {/* Reminder */}
                        {item.reminder && (
                            <div className="flex items-center justify-between rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
                                <div className="flex items-center gap-2">
                                    <Bell className="h-4 w-4 text-amber-600" />
                                    <span className="text-sm font-medium">Reminder</span>
                                    {reminderDate && (
                                        <span className="text-sm text-muted-foreground">{reminderDate}</span>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10"
                                    onClick={handleCompleteReminder}
                                >
                                    <Check className="h-4 w-4 mr-1" />
                                    Done
                                </Button>
                            </div>
                        )}

                        {/* Metadata */}
                        {createdDate && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5" />
                                Saved on {createdDate}
                            </div>
                        )}

                        <Separator />

                        {/* Actions */}
                        <div className="space-y-3">
                            {isEditing ? (
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => {
                                            setTitle(item.title || '')
                                            setNotes(item.notes || '')
                                            setTagsInput(item.tags?.join(', ') || '')
                                            setIsEditing(false)
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className="flex-1"
                                        onClick={handleSave}
                                        disabled={saving}
                                    >
                                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Save Changes
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => setIsEditing(true)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            className="w-full"
                                            asChild
                                        >
                                            <a href={item.url} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="mr-2 h-4 w-4" />
                                                Open Link
                                            </a>
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => setShowCollectionDialog(true)}
                                        >
                                            <FolderPlus className="mr-2 h-4 w-4" />
                                            Collection
                                        </Button>
                                        {!item.reminder ? (
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                                onClick={() => setShowReminderDialog(true)}
                                            >
                                                <Bell className="mr-2 h-4 w-4" />
                                                Remind Me
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                className="w-full text-amber-600"
                                                disabled
                                            >
                                                <Bell className="mr-2 h-4 w-4" />
                                                Reminder Set
                                            </Button>
                                        )}
                                    </div>

                                    <Button
                                        variant="ghost"
                                        className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={handleDelete}
                                        disabled={deleting}
                                    >
                                        {deleting ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="mr-2 h-4 w-4" />
                                        )}
                                        Delete Item
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

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
