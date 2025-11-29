'use client'

// Force dynamic rendering to avoid Supabase client initialization during build
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { CalendarIcon } from "lucide-react"
import { toast } from "sonner"

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [fullName, setFullName] = useState("")
    const [saving, setSaving] = useState(false)
    const [googleCalendarEnabled, setGoogleCalendarEnabled] = useState(false)

    useEffect(() => {
        const getUser = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUser(user)
                setFullName(user.user_metadata?.full_name || "")

                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('google_calendar_enabled')
                    .eq('user_id', user.id)
                    .single()

                if (profileError) {
                    // console.error('Profile fetch error:', profileError)
                }
                if (profile?.google_calendar_enabled) {
                    setGoogleCalendarEnabled(true)
                }
            }
            setLoading(false)
        }
        getUser()

        // Log URL params for debugging
        // console.log('Settings page loaded, URL params:', window.location.search)
    }, [])

    const handleSave = async () => {
        setSaving(true)
        const supabase = createClient()
        const { error } = await supabase.auth.updateUser({
            data: { full_name: fullName }
        })

        if (error) {
            toast.error("Failed to update profile")
        } else {
            toast.success("Profile updated")
        }
        setSaving(false)
    }

    const handleConnectGoogleCalendar = async () => {
        // console.log('Starting Google Calendar OAuth flow...')
        const supabase = createClient()
        const redirectUrl = `${window.location.origin}/auth/callback?next=/dashboard/settings&flow=connect_calendar`
        // console.log('Redirect URL:', redirectUrl)

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectUrl,
                scopes: 'https://www.googleapis.com/auth/calendar',
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        })
        if (error) {
            // console.error('OAuth error:', error)
            toast.error(error.message)
        }
    }

    const handleDisconnectGoogleCalendar = async () => {
        const supabase = createClient()
        if (!user) return

        const { error } = await supabase
            .from('profiles')
            .update({ google_calendar_enabled: false })
            .eq('user_id', user.id)

        if (error) {
            toast.error("Failed to disconnect Google Calendar")
        } else {
            setGoogleCalendarEnabled(false)
            toast.success("Google Calendar disconnected")
        }
    }

    if (loading) {
        return <Skeleton className="h-[400px] w-full max-w-2xl" />
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>
                        Manage your public profile information.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={user?.user_metadata?.avatar_url} />
                            <AvatarFallback>{user?.email?.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium">{user?.email}</p>
                            <p className="text-sm text-muted-foreground">Signed in via {user?.app_metadata?.provider || 'Email'}</p>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                            id="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Integrations</CardTitle>
                    <CardDescription>
                        Connect third-party services to Savedit.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <CalendarIcon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-medium">Google Calendar</p>
                                <p className="text-sm text-muted-foreground">Add reminders to your calendar</p>
                            </div>
                        </div>
                        <Button
                            variant={googleCalendarEnabled ? "destructive" : "default"}
                            onClick={googleCalendarEnabled ? handleDisconnectGoogleCalendar : handleConnectGoogleCalendar}
                        >
                            {googleCalendarEnabled ? "Disconnect" : "Connect"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
