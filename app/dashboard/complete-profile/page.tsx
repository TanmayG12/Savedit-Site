'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { toast } from 'sonner'
import { Loader2, User, Check, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const dynamic = 'force-dynamic'

const INTERESTS = [
    'Food', 'Travel', 'Fitness', 'Tech', 'Music', 'Learning',
    'Coffee', 'Outdoors', 'Art', 'Reading', 'Gaming', 'Cooking',
    'Photography', 'Sports', 'Fashion', 'Movies', 'Writing', 'Design'
]

export default function CompleteProfilePage() {
    const [username, setUsername] = useState('')
    const [selectedInterests, setSelectedInterests] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [checkingUsername, setCheckingUsername] = useState(false)
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
    const [usernameError, setUsernameError] = useState<string | null>(null)
    const [initialLoading, setInitialLoading] = useState(true)
    const router = useRouter()

    // Check if user is authenticated and needs to complete profile
    useEffect(() => {
        const checkAuth = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            
            if (!user) {
                router.push('/login')
                return
            }

            // Check if profile is already complete
            const { data: profile } = await supabase
                .from('profiles')
                .select('username, interests, onboarding_done')
                .eq('user_id', user.id)
                .single()

            if (profile?.onboarding_done) {
                router.push('/dashboard')
                return
            }

            // Pre-fill username if available from profile
            if (profile?.username && profile.username !== user.email?.split('@')[0]) {
                setUsername(profile.username)
            }

            setInitialLoading(false)
        }

        checkAuth()
    }, [router])

    // Debounced username check
    useEffect(() => {
        if (!username || username.length < 3) {
            setUsernameAvailable(null)
            setUsernameError(username && username.length < 3 ? 'Username must be at least 3 characters' : null)
            return
        }

        // Validate format
        if (!/^[a-z0-9_]+$/.test(username)) {
            setUsernameError('Only lowercase letters, numbers, and underscores')
            setUsernameAvailable(false)
            return
        }

        if (username.length > 20) {
            setUsernameError('Username must be less than 20 characters')
            setUsernameAvailable(false)
            return
        }

        setUsernameError(null)
        setCheckingUsername(true)

        const timer = setTimeout(async () => {
            try {
                const supabase = createClient()
                
                const { data, error } = await supabase
                    .rpc('is_username_available', { p_name: username.toLowerCase() })

                if (error) {
                    console.error('Username check error:', error)
                    setUsernameAvailable(null)
                } else {
                    setUsernameAvailable(data as boolean)
                    if (!data) {
                        setUsernameError('Username is already taken')
                    }
                }
            } catch (error) {
                console.error('Username check failed:', error)
                setUsernameAvailable(null)
            } finally {
                setCheckingUsername(false)
            }
        }, 400)

        return () => clearTimeout(timer)
    }, [username])

    const toggleInterest = (interest: string) => {
        setSelectedInterests(prev =>
            prev.includes(interest)
                ? prev.filter(i => i !== interest)
                : [...prev, interest]
        )
    }

    const isValid = username.length >= 3 && 
                    usernameAvailable === true && 
                    selectedInterests.length >= 2 &&
                    !usernameError

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isValid || loading) return

        setLoading(true)

        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                toast.error('Please sign in again')
                router.push('/login')
                return
            }

            // Update profile with username and interests
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    username: username.toLowerCase().trim(),
                    interests: selectedInterests,
                    onboarding_done: true,
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', user.id)

            if (profileError) {
                console.error('Profile update error:', profileError)
                toast.error('Failed to save profile. Please try again.')
                return
            }

            // Create interest-based collections (optional, fire and forget)
            try {
                await supabase.rpc('create_interest_collections', { 
                    interest_names: selectedInterests 
                })
            } catch (error) {
                // Non-critical, continue
                console.warn('Failed to create interest collections:', error)
            }

            toast.success('Profile completed!')
            router.push('/dashboard')
            router.refresh()
        } catch (error) {
            console.error('Profile completion error:', error)
            toast.error('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (initialLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-lg mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-8">
                    <Link 
                        href="/dashboard" 
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Skip for now
                    </Link>
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                        Complete your profile
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Choose a username and select your interests to personalize your experience.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Username Field */}
                    <div className="space-y-2">
                        <Label htmlFor="username" className="text-sm font-medium">
                            Username
                        </Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="username"
                                type="text"
                                placeholder="yourname"
                                value={username}
                                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                className="h-11 pl-10 pr-10 text-sm"
                                disabled={loading}
                            />
                            {checkingUsername && (
                                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                            )}
                            {!checkingUsername && usernameAvailable === true && username.length >= 3 && (
                                <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                            )}
                        </div>
                        {usernameError && (
                            <p className="text-xs text-destructive">{usernameError}</p>
                        )}
                        {!usernameError && usernameAvailable === true && (
                            <p className="text-xs text-green-600 dark:text-green-400">Username is available</p>
                        )}
                    </div>

                    {/* Interests Selection */}
                    <div className="space-y-3">
                        <div>
                            <Label className="text-sm font-medium">
                                What interests you?
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">
                                Select at least 2 topics to personalize your collections
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {INTERESTS.map((interest) => {
                                const isSelected = selectedInterests.includes(interest)
                                return (
                                    <button
                                        key={interest}
                                        type="button"
                                        onClick={() => toggleInterest(interest)}
                                        disabled={loading}
                                        className={`
                                            px-4 py-2 rounded-full text-sm font-medium transition-all
                                            ${isSelected 
                                                ? 'bg-foreground text-background shadow-md' 
                                                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border'
                                            }
                                            disabled:opacity-50 disabled:cursor-not-allowed
                                        `}
                                    >
                                        {interest}
                                    </button>
                                )
                            })}
                        </div>
                        {selectedInterests.length > 0 && selectedInterests.length < 2 && (
                            <p className="text-xs text-amber-600 dark:text-amber-400">
                                Select {2 - selectedInterests.length} more interest{2 - selectedInterests.length === 1 ? '' : 's'}
                            </p>
                        )}
                        {selectedInterests.length >= 2 && (
                            <p className="text-xs text-green-600 dark:text-green-400">
                                ✓ {selectedInterests.length} interests selected
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full h-11 text-sm font-medium"
                        disabled={!isValid || loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Complete Profile'
                        )}
                    </Button>
                </form>

                {/* Info */}
                <p className="mt-6 text-center text-xs text-muted-foreground">
                    Your interests help us create personalized collections and suggest relevant tags for your saves.
                </p>
            </div>
        </div>
    )
}
