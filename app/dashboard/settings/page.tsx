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
import { toast } from "sonner"

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [fullName, setFullName] = useState("")
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        const getUser = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUser(user)
                setFullName(user.user_metadata?.full_name || "")
            }
            setLoading(false)
        }
        getUser()
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
        </div>
    )
}
