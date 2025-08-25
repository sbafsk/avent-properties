import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })

    // Refresh session if expired
    const {
        data: { session },
    } = await supabase.auth.getSession()

    // Define protected routes
    const protectedRoutes = [
        '/dashboard',
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
        redirectUrl.pathname = '/auth/signin'
        redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
    }

    // If accessing admin route, check user role
    if (isAdminRoute && session) {
        try {
            const { data: user } = await supabase
                .from('users')
                .select('role')
                .eq('id', session.user.id)
                .single()

            if (user?.role !== 'ADMIN') {
                const redirectUrl = req.nextUrl.clone()
                redirectUrl.pathname = '/dashboard'
                return NextResponse.redirect(redirectUrl)
            }
        } catch (error) {
            console.error('Error checking user role:', error)
            const redirectUrl = req.nextUrl.clone()
            redirectUrl.pathname = '/auth/signin'
            return NextResponse.redirect(redirectUrl)
        }
    }

    // If accessing agency route, check user role
    if (isAgencyRoute && session) {
        try {
            const { data: user } = await supabase
                .from('users')
                .select('role')
                .eq('id', session.user.id)
                .single()

            if (user?.role !== 'AGENCY') {
                const redirectUrl = req.nextUrl.clone()
                redirectUrl.pathname = '/dashboard'
                return NextResponse.redirect(redirectUrl)
            }
        } catch (error) {
            console.error('Error checking user role:', error)
            const redirectUrl = req.nextUrl.clone()
            redirectUrl.pathname = '/auth/signin'
            return NextResponse.redirect(redirectUrl)
        }
    }

    // If user is authenticated and trying to access auth pages, redirect to dashboard
    if (session && req.nextUrl.pathname.startsWith('/auth')) {
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = '/dashboard'
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
