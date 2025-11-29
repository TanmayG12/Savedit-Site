'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { toast } from 'sonner'
import { Loader2, Lock, Eye, EyeOff, ArrowLeft, Check, Smartphone } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const dynamic = 'force-dynamic'

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [initializing, setInitializing] = useState(true)
    const [hasSession, setHasSession] = useState(false)
    const [isMobileDeepLink, setIsMobileDeepLink] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const supabase = createClient()
        let mounted = true
        let resolved = false

        const checkSession = async () => {
            // Check if this is from the mobile app deep link (savedit:// scheme)
            // If someone clicks the mobile reset link on web, we show a message to open on mobile
            const urlParams = new URLSearchParams(window.location.search)
            const hashParams = new URLSearchParams(window.location.hash.substring(1))
            
            // Check for mobile scheme redirect (this won't typically reach here, but just in case)
            if (window.location.href.includes('savedit://')) {
                if (mounted && !resolved) {
                    resolved = true
                    setIsMobileDeepLink(true)
                    setInitializing(false)
                }
                return
            }

            // Check for recovery token in hash (implicit flow)
            const hash = window.location.hash
            if (hash && hash.includes('type=recovery')) {
                console.log('Recovery token detected in hash')
                
                // Let Supabase process the hash
                const { data: { session }, error } = await supabase.auth.getSession()
                
                if (session && !error) {
                    console.log('Session established from hash')
                    if (mounted && !resolved) {
                        resolved = true
                        setHasSession(true)
                        setInitializing(false)
                    }
                    // Clear the hash from URL
                    window.history.replaceState(null, '', window.location.pathname)
                    return
                }

                // Listen for auth state change
                const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                    console.log('Auth state change:', event)
                    if ((event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') && session && !resolved) {
                        resolved = true
                        if (mounted) {
                            setHasSession(true)
                            setInitializing(false)
                        }
                        subscription.unsubscribe()
                    }
                })

                // Timeout fallback
                setTimeout(() => {
                    if (mounted && !resolved) {
                        console.log('Recovery timeout')
                        resolved = true
                        setInitializing(false)
                        subscription.unsubscribe()
                    }
                }, 5000)
            } else {
                // Check if we already have a session (coming from /auth/confirm)
                const { data: { session } } = await supabase.auth.getSession()
                if (mounted) {
                    setHasSession(!!session)
                    setInitializing(false)
                }
            }
        }

        checkSession()

        return () => {
            mounted = false
        }
    }, [])

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        if (password.length < 8) {
            toast.error('Password must be at least 8 characters')
            return
        }

        setLoading(true)

        try {
            const supabase = createClient()
            const { error } = await supabase.auth.updateUser({
                password: password,
            })

            if (error) {
                toast.error(error.message)
                return
            }

            setSuccess(true)
            toast.success('Password updated successfully!')

            // Clear hash and redirect after delay
            window.history.replaceState(null, '', '/login')
            setTimeout(() => {
                router.push('/dashboard')
                router.refresh()
            }, 1500)
        } catch (error: unknown) {
            toast.error('Something went wrong. Please try again.')
            console.error('Reset password error:', error)
        } finally {
            setLoading(false)
        }
    }

    // Loading state
    if (initializing) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    // Mobile deep link message - show when user clicks mobile app link on web
    if (isMobileDeepLink) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-6">
                <div className="max-w-md w-full space-y-6 text-center">
                    <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <Smartphone className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h1 className="text-2xl font-semibold text-foreground">Open in SavedIt App</h1>
                    <p className="text-muted-foreground">
                        This password reset link is for the SavedIt mobile app. 
                        Please open this link on your mobile device with the SavedIt app installed.
                    </p>
                    <div className="pt-4">
                        <Link href="/login?mode=forgot" className="text-primary hover:underline">
                            Or request a new reset link for web
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    // No session - show error/redirect
    if (!hasSession) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-6">
                <div className="max-w-md w-full space-y-6 text-center">
                    <h1 className="text-2xl font-semibold text-foreground">Link Expired or Invalid</h1>
                    <p className="text-muted-foreground">
                        This password reset link has expired or is invalid. 
                        Please request a new password reset link.
                    </p>
                    <div className="pt-4">
                        <Link href="/login?mode=forgot">
                            <Button>Request New Link</Button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    // Success state
    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-6">
                <div className="max-w-md w-full space-y-6 text-center">
                    <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h1 className="text-2xl font-semibold text-foreground">Password Updated!</h1>
                    <p className="text-muted-foreground">
                        Your password has been successfully updated. Redirecting to dashboard...
                    </p>
                </div>
            </div>
        )
    }

    // Password reset form
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
            <div className="max-w-md w-full space-y-6">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold text-foreground">Set New Password</h1>
                    <p className="mt-2 text-muted-foreground">
                        Enter your new password below
                    </p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter new password"
                                className="pl-10 pr-10"
                                required
                                minLength={8}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                className="pl-10 pr-10"
                                required
                                minLength={8}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading || !password || !confirmPassword}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            'Update Password'
                        )}
                    </Button>
                </form>

                <div className="text-center">
                    <Link 
                        href="/login" 
                        className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center"
                    >
                        <ArrowLeft className="mr-1 h-3 w-3" />
                        Back to login
                    </Link>
                </div>
            </div>
        </div>
    )
}
