'use client'

import { useMemo, useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
    Loader2,
    Plus,
    X,
    Link as LinkIcon,
    Clipboard,
    ChevronDown,
    Check,
    FolderPlus,
    Tag,
    FileText,
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface PageMetadata {
    title?: string
    description?: string
    image?: string
    favicon?: string
    siteName?: string
}

interface Collection {
    id: string
    name: string
    item_count?: number
}

export function QuickSaveFloating() {
    const [open, setOpen] = useState(false)
    const [url, setUrl] = useState("")
    const [title, setTitle] = useState("")
    const [notes, setNotes] = useState("")
    const [saving, setSaving] = useState(false)
    const [fetchingMetadata, setFetchingMetadata] = useState(false)
    const [metadata, setMetadata] = useState<PageMetadata | null>(null)
    
    // Tags state
    const [tags, setTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState("")
    
    // Collections state
    const [collections, setCollections] = useState<Collection[]>([])
    const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null)
    const [loadingCollections, setLoadingCollections] = useState(false)
    
    const supabase = useMemo(() => createClient(), [])
    const router = useRouter()

    // Load collections when dialog opens
    useEffect(() => {
        if (!open) return
        
        const loadCollections = async () => {
            setLoadingCollections(true)
            try {
                const { data: { session } } = await supabase.auth.getSession()
                if (!session) return

                const { data, error } = await supabase.rpc('list_accessible_collections_for_user', {
                    p_user_id: session.user.id,
                })

                if (error) {
                    console.error('Error loading collections:', error)
                    // Fallback to owned collections
                    const { data: owned } = await supabase
                        .from('collections')
                        .select('id, name, item_count')
                        .eq('owner_id', session.user.id)
                        .order('updated_at', { ascending: false })
                    
                    setCollections((owned || []).map(c => ({
                        id: c.id,
                        name: c.name,
                        item_count: Number(c.item_count ?? 0),
                    })))
                } else {
                    setCollections((data || []).map((c: any) => ({
                        id: c.collection_id ?? c.id,
                        name: c.title ?? c.name ?? 'Untitled',
                        item_count: Number(c.item_count ?? 0),
                    })))
                }
            } catch (err) {
                console.error('Failed to load collections:', err)
            } finally {
                setLoadingCollections(false)
            }
        }

        loadCollections()
    }, [open, supabase])

    // Fetch metadata when URL changes
    const fetchMetadata = useCallback(async (inputUrl: string) => {
        const trimmedUrl = inputUrl.trim()
        if (!trimmedUrl) return

        // Validate URL
        try {
            new URL(trimmedUrl)
        } catch {
            return
        }

        setFetchingMetadata(true)
        try {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) return

            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
            const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
            
            if (!supabaseUrl || !supabaseAnonKey) return

            // Call the metadata fetch edge function
            const response = await fetch(`${supabaseUrl}/functions/v1/fetch-metadata`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                    'apikey': supabaseAnonKey,
                },
                body: JSON.stringify({ url: trimmedUrl }),
            })

            if (response.ok) {
                const data = await response.json()
                setMetadata(data)
                if (data.title && !title) {
                    setTitle(data.title)
                }
            }
        } catch (err) {
            console.error('Failed to fetch metadata:', err)
        } finally {
            setFetchingMetadata(false)
        }
    }, [supabase, title])

    // Handle paste from clipboard
    const handlePasteFromClipboard = async () => {
        try {
            const text = await navigator.clipboard.readText()
            if (text) {
                // Check if it's a valid URL
                try {
                    new URL(text)
                    setUrl(text)
                    fetchMetadata(text)
                } catch {
                    // Not a valid URL, just paste it
                    setUrl(text)
                }
            }
        } catch (err) {
            console.error('Failed to read clipboard:', err)
            toast.error('Could not access clipboard')
        }
    }

    // Handle URL input change with debounced metadata fetch
    const handleUrlChange = (value: string) => {
        setUrl(value)
        // Reset metadata when URL changes
        setMetadata(null)
    }

    // Handle URL blur to fetch metadata
    const handleUrlBlur = () => {
        if (url.trim()) {
            fetchMetadata(url)
        }
    }

    // Handle tag input
    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            addTag()
        }
    }

    const addTag = () => {
        const newTags = tagInput
            .split(',')
            .map(t => t.trim())
            .filter(t => t && !tags.includes(t))
        
        if (newTags.length > 0) {
            setTags([...tags, ...newTags])
        }
        setTagInput("")
    }

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(t => t !== tagToRemove))
    }

    // Reset form
    const resetForm = () => {
        setUrl("")
        setTitle("")
        setNotes("")
        setTags([])
        setTagInput("")
        setSelectedCollectionId(null)
        setMetadata(null)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const trimmedUrl = url.trim()

        if (!trimmedUrl) {
            toast.error("Enter a link to save")
            return
        }

        setSaving(true)
        try {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                toast.error("Sign in to save links")
                router.push("/login")
                return
            }

            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
            const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
            
            if (!supabaseUrl || !supabaseAnonKey) {
                toast.error("Configuration error. Please try again later.")
                return
            }

            // Normalize URL
            let normalizedUrl = trimmedUrl
            try {
                const urlObj = new URL(trimmedUrl)
                normalizedUrl = urlObj.href.toLowerCase().replace(/\/$/, '')
            } catch {
                normalizedUrl = trimmedUrl.toLowerCase()
            }

            // Build payload for direct insert (more control than edge function)
            const payload: Record<string, unknown> = {
                url: trimmedUrl,
                url_normalized: normalizedUrl,
                title: title.trim() || metadata?.title || 'Untitled',
                notes: notes.trim() || null,
                tags: tags.length > 0 ? tags : [],
                user_id: session.user.id,
                status: 'queued',
            }

            // Add metadata if available
            if (metadata?.description) {
                payload.description = metadata.description
            }
            if (metadata?.image) {
                payload.thumbnail_url = metadata.image
            }

            // Insert the saved item
            const { data: savedItems, error: saveError } = await supabase
                .from('saved_items')
                .insert(payload)
                .select()

            if (saveError) {
                console.error("Save error:", saveError)
                // Check for duplicate URL error
                if (saveError.code === '23505') {
                    toast.error("This link is already saved")
                } else {
                    toast.error(saveError.message || "Could not save this link")
                }
                return
            }

            const savedItem = savedItems?.[0]

            // If a collection is selected, add to collection
            if (selectedCollectionId && savedItem?.id) {
                const { error: collectionError } = await supabase
                    .from('collection_items')
                    .insert({
                        collection_id: selectedCollectionId,
                        saved_item_id: savedItem.id,
                    })

                if (collectionError) {
                    console.warn('Failed to add to collection:', collectionError)
                    toast.success("Saved! (Could not add to collection)")
                } else {
                    toast.success("Saved to collection!")
                }
            } else {
                toast.success("Saved!")
            }

            resetForm()
            setOpen(false)
            router.refresh()
        } catch (err) {
            console.error("Quick save error", err)
            toast.error("Could not save this link")
        } finally {
            setSaving(false)
        }
    }

    const selectedCollection = collections.find(c => c.id === selectedCollectionId)

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
            {open && (
                <div className="w-[400px] overflow-hidden rounded-2xl border border-border/60 bg-card/95 shadow-2xl backdrop-blur-md">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b px-4 py-3">
                        <div className="space-y-1">
                            <p className="text-sm font-semibold">Quick Save</p>
                            <p className="text-xs text-muted-foreground">Save any link with full details.</p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                                resetForm()
                                setOpen(false)
                            }}
                            aria-label="Close quick save"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    <form className="space-y-4 px-4 py-4" onSubmit={handleSubmit}>
                        {/* URL Input with Paste Button */}
                        <div className="space-y-2">
                            <Label htmlFor="qs-url" className="flex items-center gap-2">
                                <LinkIcon className="h-3.5 w-3.5" />
                                Link
                            </Label>
                            <div className="flex gap-2">
                                <Input
                                    id="qs-url"
                                    placeholder="https://example.com/article"
                                    type="url"
                                    autoComplete="url"
                                    value={url}
                                    onChange={(e) => handleUrlChange(e.target.value)}
                                    onBlur={handleUrlBlur}
                                    required
                                    className="flex-1"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={handlePasteFromClipboard}
                                    title="Paste from clipboard"
                                >
                                    <Clipboard className="h-4 w-4" />
                                </Button>
                            </div>
                            {fetchingMetadata && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                    Fetching page info...
                                </div>
                            )}
                        </div>

                        {/* Metadata Preview */}
                        {metadata && (
                            <div className="flex gap-3 rounded-lg border border-border/60 bg-muted/30 p-3">
                                {metadata.image && (
                                    <img 
                                        src={metadata.image} 
                                        alt="" 
                                        className="h-16 w-24 rounded object-cover flex-shrink-0"
                                        onError={(e) => e.currentTarget.style.display = 'none'}
                                    />
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{metadata.title || 'Untitled'}</p>
                                    {metadata.description && (
                                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                            {metadata.description}
                                        </p>
                                    )}
                                    {metadata.siteName && (
                                        <p className="text-xs text-muted-foreground mt-1">{metadata.siteName}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="qs-title" className="flex items-center gap-2">
                                <FileText className="h-3.5 w-3.5" />
                                Title
                            </Label>
                            <Input
                                id="qs-title"
                                placeholder={metadata?.title || "Add a title (auto-detected if available)"}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        {/* Collection Selection */}
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <FolderPlus className="h-3.5 w-3.5" />
                                Collection
                            </Label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full justify-between"
                                        disabled={loadingCollections}
                                    >
                                        {loadingCollections ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                Loading...
                                            </>
                                        ) : selectedCollection ? (
                                            <span className="truncate">{selectedCollection.name}</span>
                                        ) : (
                                            <span className="text-muted-foreground">No collection</span>
                                        )}
                                        <ChevronDown className="h-4 w-4 opacity-50 ml-2" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-[352px] max-h-[200px] overflow-y-auto">
                                    <DropdownMenuItem onClick={() => setSelectedCollectionId(null)}>
                                        <div className="flex items-center justify-between w-full">
                                            <span>No collection</span>
                                            {!selectedCollectionId && <Check className="h-4 w-4" />}
                                        </div>
                                    </DropdownMenuItem>
                                    {collections.map((collection) => (
                                        <DropdownMenuItem
                                            key={collection.id}
                                            onClick={() => setSelectedCollectionId(collection.id)}
                                        >
                                            <div className="flex items-center justify-between w-full">
                                                <span className="truncate">{collection.name}</span>
                                                {selectedCollectionId === collection.id && (
                                                    <Check className="h-4 w-4 ml-2" />
                                                )}
                                            </div>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Tags */}
                        <div className="space-y-2">
                            <Label htmlFor="qs-tags" className="flex items-center gap-2">
                                <Tag className="h-3.5 w-3.5" />
                                Tags
                            </Label>
                            <Input
                                id="qs-tags"
                                placeholder="Add tags (press Enter or comma)"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleTagKeyDown}
                                onBlur={addTag}
                            />
                            {tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {tags.map((tag) => (
                                        <Badge
                                            key={tag}
                                            variant="secondary"
                                            className="pl-2 pr-1 py-0.5 text-xs flex items-center gap-1"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                className="ml-1 hover:bg-muted rounded-full p-0.5"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                            <Label htmlFor="qs-notes">Notes (optional)</Label>
                            <Textarea
                                id="qs-notes"
                                placeholder="Add your thoughts..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={2}
                                className="resize-none"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-2 pt-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    resetForm()
                                    setOpen(false)
                                }}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" size="sm" disabled={saving || !url.trim()}>
                                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            <Button
                size="icon"
                className="h-12 w-12 rounded-full shadow-xl shadow-primary/20"
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? "Hide quick save" : "Open quick save"}
            >
                {open ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            </Button>
        </div>
    )
}
