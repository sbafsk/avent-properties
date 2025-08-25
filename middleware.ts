import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    let res = NextResponse.next({
        request: {
            headers: req.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return req.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => req.cookies.set(name, value))
                    res = NextResponse.next({
                        request: {
                            headers: req.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options))
                },
            },
        }
    )

    // Refresh session if expired
    const {
        data: { session },
    } = await supabase.auth.getSession()

    // Define protected routes
    const protectedRoutes = [
        '/(dashboard)',
        '/reserve',
        '/profile',
        '/admin',
        '/agency',
    ]

    // Define admin-only routes
    const adminRoutes = ['/admin']

    // Define agency-only routes
    const agencyRoutes = ['/agency']

    // Check if current path is protected
    const isProtectedRoute = protectedRoutes.some((route) =>
        req.nextUrl.pathname.startsWith(route)
    )

    const isAdminRoute = adminRoutes.some((route) =>
        req.nextUrl.pathname.startsWith(route)
    )

    const isAgencyRoute = agencyRoutes.some((route) =>
        req.nextUrl.pathname.startsWith(route)
    )

    // If accessing protected route without session, redirect to login
    if (isProtectedRoute && !session) {
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = '/signin'
        redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
    }

    // TODO: Add role-based access control later
    // For now, allow all authenticated users to access all routes

    // If user is authenticated and trying to access auth pages, redirect to dashboard
    if (session && (req.nextUrl.pathname.startsWith('/signin') || req.nextUrl.pathname.startsWith('/signup'))) {
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = '/overview'
        return NextResponse.redirect(redirectUrl)
    }

    return res
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    ],
}
