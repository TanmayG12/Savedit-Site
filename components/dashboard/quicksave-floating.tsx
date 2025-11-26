'use client'

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2, Plus, X } from "lucide-react"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export function QuickSaveFloating() {
    const [open, setOpen] = useState(false)
    const [url, setUrl] = useState("")
    const [title, setTitle] = useState("")
    const [saving, setSaving] = useState(false)
    const supabase = useMemo(() => createClient(), [])
    const router = useRouter()

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

            // Call the quick-save Edge Function (same pipeline as mobile app)
            const response = await fetch(`${SUPABASE_URL}/functions/v1/quick-save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                    'apikey': SUPABASE_ANON_KEY,
                },
                body: JSON.stringify({
                    url: trimmedUrl,
                    source: 'web-dashboard',
                }),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                console.error("Quick save failed", errorData)
                toast.error(errorData.error || "Could not save this link")
                return
            }

            const result = await response.json()
            if (result.status === 'ok' || result.success) {
                toast.success("Saved")
                setUrl("")
                setTitle("")
                setOpen(false)
                router.refresh()
            } else {
                console.error("Quick save unexpected response", result)
                toast.error("Could not save this link")
            }
        } catch (err) {
            console.error("Quick save error", err)
            toast.error("Could not save this link")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
            {open && (
                <div className="w-[360px] overflow-hidden rounded-2xl border border-border/60 bg-card/95 shadow-2xl backdrop-blur-md">
                    <div className="flex items-center justify-between border-b px-4 py-3">
                        <div className="space-y-1">
                            <p className="text-sm font-semibold">Quick Save</p>
                            <p className="text-xs text-muted-foreground">Drop a link to save it instantly.</p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setOpen(false)}
                            aria-label="Close quick save"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    <form className="space-y-4 px-4 py-4" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="qs-url">Link</Label>
                            <Input
                                id="qs-url"
                                placeholder="https://example.com/article"
                                type="url"
                                autoComplete="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="qs-title">Title (optional)</Label>
                            <Input
                                id="qs-title"
                                placeholder="Add a short title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" size="sm" disabled={saving}>
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
