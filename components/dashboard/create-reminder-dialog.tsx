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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { createClient } from "@/lib/supabase"
import { toast } from "sonner"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface CreateReminderDialogProps {
    itemId: string
    trigger?: React.ReactNode
    renderTrigger?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function CreateReminderDialog({
    itemId,
    trigger,
    renderTrigger = true,
    open: controlledOpen,
    onOpenChange: setControlledOpen,
}: CreateReminderDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false)
    const open = controlledOpen ?? internalOpen
    const setOpen = setControlledOpen ?? setInternalOpen

    const [date, setDate] = useState<Date>()
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const handleCreate = async () => {
        if (!date) {
            toast.error("Please select a date and time")
            return
        }

        setLoading(true)

        // Try calling the Edge Function first
        const { error: funcError } = await supabase.functions.invoke('create_reminder', {
            body: {
                savedItemId: itemId,
                fireAt: date.toISOString(),
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            }
        })

        if (funcError) {
            console.error('Edge function failed, trying direct insert:', funcError)
            // Fallback to direct insert if Edge Function fails (though EF is preferred for side effects)
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { error: dbError } = await supabase
                    .from('reminders')
                    .insert({
                        user_id: user.id,
                        saved_item_id: itemId,
                        fire_at_utc: date.toISOString(),
                        status: 'pending'
                    })

                if (dbError) {
                    console.error('Direct insert failed:', dbError)
                    toast.error("Failed to set reminder")
                } else {
                    toast.success("Reminder set!")
                    setOpen(false)
                }
            }
        } else {
            toast.success("Reminder set!")
            setOpen(false)
        }
        setLoading(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {renderTrigger ? (
                <DialogTrigger asChild>
                    {trigger || <Button variant="outline" size="sm">Set Reminder</Button>}
                </DialogTrigger>
            ) : null}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Set Reminder</DialogTitle>
                    <DialogDescription>
                        Choose when you want to be reminded about this item.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex flex-col gap-2">
                        <Label>Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleCreate} disabled={loading}>
                        {loading ? "Setting..." : "Set Reminder"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
