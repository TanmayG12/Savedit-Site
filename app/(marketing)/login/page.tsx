'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { toast } from 'sonner'
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

// Force dynamic rendering to avoid Supabase client initialization during build
export const dynamic = 'force-dynamic'

type AuthMode = 'login' | 'register' | 'forgot-password'

export default function LoginPage() {
    const [mode, setMode] = useState<AuthMode>('login')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [socialLoading, setSocialLoading] = useState<'google' | 'apple' | null>(null)
    const [resetEmailSent, setResetEmailSent] = useState(false)
    const router = useRouter()

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const supabase = createClient()

            if (mode === 'register') {
                if (password !== confirmPassword) {
                    toast.error('Passwords do not match')
                    setLoading(false)
                    return
                }

                if (password.length < 8) {
                    toast.error('Password must be at least 8 characters')
                    setLoading(false)
                    return
                }

                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/dashboard`,
                    },
                })

                if (error) {
                    toast.error(error.message)
                    return
                }

                toast.success('Check your email to confirm your account!')
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })

                if (error) {
                    toast.error(error.message)
                    return
                }

                router.push('/dashboard')
                router.refresh()
            }
        } catch (error: unknown) {
            const err = error as Error & { name?: string }
            if (err?.message?.includes('fetch') || err?.name === 'TypeError') {
                toast.error('Unable to connect. Please check your internet connection.')
            } else {
                toast.error('Something went wrong. Please try again.')
            }
            console.error('Auth error:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSocialAuth = async (provider: 'google' | 'apple') => {
        setSocialLoading(provider)
        try {
            const supabase = createClient()
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    // OAuth users go to complete-profile first, which will redirect to dashboard if already complete
                    redirectTo: `${window.location.origin}/dashboard/complete-profile`,
                },
            })

            if (error) {
                toast.error(error.message)
            }
        } catch (error: unknown) {
            toast.error('Something went wrong. Please try again.')
            console.error('Social auth error:', error)
        } finally {
            setSocialLoading(null)
        }
    }

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) {
            toast.error('Please enter your email address')
            return
        }
        setLoading(true)

        try {
            const supabase = createClient()
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/login?reset=true`,
            })

            if (error) {
                toast.error(error.message)
                return
            }

            setResetEmailSent(true)
            toast.success('Check your email for the password reset link!')
        } catch (error: unknown) {
            toast.error('Something went wrong. Please try again.')
            console.error('Reset password error:', error)
        } finally {
            setLoading(false)
        }
    }

    const toggleMode = () => {
        if (mode === 'forgot-password') {
            setMode('login')
        } else {
            setMode(mode === 'login' ? 'register' : 'login')
        }
        setPassword('')
        setConfirmPassword('')
        setResetEmailSent(false)
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Branding/Image */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
                        backgroundSize: '32px 32px',
                    }} />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-between p-8 text-white w-full h-full">
                    {/* Logo/Brand */}
                    <Link href="/" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
                        <ArrowLeft className="h-5 w-5" />
                        <span className="text-lg font-medium">Back to home</span>
                    </Link>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col items-center justify-center py-4">
                        {/* App Screenshot */}
                        <div className="relative w-full max-w-[200px] xl:max-w-[240px] mx-auto">
                            <div className="absolute -inset-3 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-[2rem] blur-2xl" />
                            <Image
                                src="/Screenshots/1.png"
                                alt="SavedIt app interface"
                                width={1080}
                                height={2336}
                                className="relative z-10 w-full h-auto rounded-[1.5rem] shadow-2xl"
                                priority
                            />
                        </div>

                        {/* Tagline */}
                        <div className="mt-6 text-center max-w-sm">
                            <h2 className="text-2xl xl:text-3xl font-semibold tracking-tight">
                                Save what inspires you.
                            </h2>
                            <p className="mt-2 text-base text-neutral-300">
                                Articles, videos, or reels — all your saves, automatically organized with AI.
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center text-sm text-neutral-400">
                        © {new Date().getFullYear()} SavedIt. All rights reserved.
                    </div>
                </div>
            </div>

            {/* Right Panel - Auth Form */}
            <div className="flex-1 flex flex-col h-screen bg-background overflow-hidden">
                {/* Mobile Header */}
                <div className="lg:hidden p-4 border-b border-border">
                    <Link href="/" className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity">
                        <ArrowLeft className="h-5 w-5" />
                        <span className="text-lg font-medium">Back</span>
                    </Link>
                </div>

                {/* Auth Form Container */}
                <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-8 overflow-y-auto">
                    <div className="w-full max-w-[400px] space-y-5">
                        {/* Header */}
                        <div className="text-center lg:text-left">
                            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                                {mode === 'login' ? 'Welcome back' : mode === 'register' ? 'Create an account' : 'Reset password'}
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {mode === 'login'
                                    ? 'Sign in to access your saved items'
                                    : mode === 'register'
                                    ? 'Start saving and organizing your content'
                                    : 'Enter your email and we\'ll send you a reset link'}
                            </p>
                        </div>

                        {/* Social Auth Buttons */}
                        {mode !== 'forgot-password' && (
                        <div className="space-y-2">
                            <Button
                                variant="outline"
                                className="w-full h-11 text-sm font-medium gap-2 hover:bg-accent transition-colors"
                                onClick={() => handleSocialAuth('google')}
                                disabled={socialLoading !== null || loading}
                            >
                                {socialLoading === 'google' ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                                        <path
                                            fill="currentColor"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                )}
                                Continue with Google
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full h-11 text-sm font-medium gap-2 hover:bg-accent transition-colors"
                                onClick={() => handleSocialAuth('apple')}
                                disabled={socialLoading !== null || loading}
                            >
                                {socialLoading === 'apple' ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                    </svg>
                                )}
                                Continue with Apple
                            </Button>
                        </div>
                        )}

                        {/* Divider */}
                        {mode !== 'forgot-password' && (
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <Separator className="w-full" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-3 text-muted-foreground">
                                    or continue with email
                                </span>
                            </div>
                        </div>
                        )}

                        {/* Forgot Password Form */}
                        {mode === 'forgot-password' ? (
                            resetEmailSent ? (
                                <div className="space-y-4 text-center">
                                    <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                        <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-medium text-foreground">Check your email</h3>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            We&apos;ve sent a password reset link to <strong>{email}</strong>
                                        </p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="w-full h-10"
                                        onClick={() => {
                                            setMode('login')
                                            setResetEmailSent(false)
                                        }}
                                    >
                                        Back to sign in
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleForgotPassword} className="space-y-3">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="reset-email" className="text-sm font-medium">
                                            Email address
                                        </Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="reset-email"
                                                type="email"
                                                placeholder="you@example.com"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="h-10 pl-9 text-sm"
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-10 text-sm font-medium"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            'Send reset link'
                                        )}
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="w-full h-10 text-sm"
                                        onClick={() => setMode('login')}
                                        disabled={loading}
                                    >
                                        Back to sign in
                                    </Button>
                                </form>
                            )
                        ) : (
                        /* Email Form */
                        <form onSubmit={handleEmailAuth} className="space-y-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-sm font-medium">
                                    Email address
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-10 pl-9 text-sm"
                                        disabled={loading || socialLoading !== null}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="password" className="text-sm font-medium">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-10 pl-9 pr-9 text-sm"
                                        disabled={loading || socialLoading !== null}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {mode === 'register' && (
                                <div className="space-y-1.5">
                                    <Label htmlFor="confirmPassword" className="text-sm font-medium">
                                        Confirm password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="h-10 pl-9 pr-9 text-sm"
                                            disabled={loading || socialLoading !== null}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                            tabIndex={-1}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {mode === 'login' && (
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setMode('forgot-password')}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-10 text-sm font-medium"
                                disabled={loading || socialLoading !== null}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                                    </>
                                ) : mode === 'login' ? (
                                    'Sign in'
                                ) : (
                                    'Create account'
                                )}
                            </Button>
                        </form>
                        )}

                        {/* Toggle Mode */}
                        {mode !== 'forgot-password' && (
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">
                                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
                                <button
                                    type="button"
                                    onClick={toggleMode}
                                    className="font-medium text-foreground hover:underline transition-colors"
                                    disabled={loading || socialLoading !== null}
                                >
                                    {mode === 'login' ? 'Sign up' : 'Sign in'}
                                </button>
                            </p>
                        </div>
                        )}

                        {/* Terms */}
                        {mode === 'register' && (
                            <p className="text-center text-xs text-muted-foreground">
                                By creating an account, you agree to our{' '}
                                <Link href="/legal/terms" className="underline hover:text-foreground">
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link href="/legal/privacy" className="underline hover:text-foreground">
                                    Privacy Policy
                                </Link>
                            </p>
                        )}
                    </div>
                </div>

                {/* Mobile Footer */}
                <div className="lg:hidden p-4 text-center text-sm text-muted-foreground border-t border-border">
                    © {new Date().getFullYear()} SavedIt
                </div>
            </div>
        </div>
    )
}
