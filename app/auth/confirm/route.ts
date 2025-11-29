import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const token_hash = requestUrl.searchParams.get('token_hash')
    const type = requestUrl.searchParams.get('type') as 'recovery' | 'signup' | 'invite' | 'magiclink' | 'email_change' | null
    const next = requestUrl.searchParams.get('next') ?? '/dashboard'
    const redirectTo = new URL(next, requestUrl.origin)

    if (token_hash && type) {
        const cookieStore = await cookies()

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            )
                        } catch {
                            // The `setAll` method was called from a Server Component.
                            // This can be ignored if you have middleware refreshing
                            // user sessions.
                        }
                    },
                },
            }
        )

        const { error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        })

        if (error) {
            // Redirect to login with error
            const errorUrl = new URL('/login', requestUrl.origin)
            errorUrl.searchParams.set('error', 'access_denied')
            errorUrl.searchParams.set('error_code', 'otp_expired')
            errorUrl.searchParams.set('error_description', error.message || 'The link has expired or is invalid')
            return NextResponse.redirect(errorUrl)
        }

        // For recovery, redirect to reset-password page
        if (type === 'recovery') {
            return NextResponse.redirect(new URL('/auth/reset-password', requestUrl.origin))
        }
    }

    // Redirect to login if no token or type
    return NextResponse.redirect(redirectTo)
}
