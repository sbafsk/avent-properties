import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
    const { supabaseResponse, user, session } = await updateSession(request)

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
        request.nextUrl.pathname.startsWith(route)
    )

    const isAdminRoute = adminRoutes.some((route) =>
        request.nextUrl.pathname.startsWith(route)
    )

    const isAgencyRoute = agencyRoutes.some((route) =>
        request.nextUrl.pathname.startsWith(route)
    )

    // If accessing protected route without session, redirect to login
    if (isProtectedRoute && !session) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/signin'
        redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
    }

    // TODO: Add role-based access control later
    // For now, allow all authenticated users to access all routes

    // If user is authenticated and trying to access auth pages, redirect to dashboard
    if (session && (request.nextUrl.pathname.startsWith('/signin') || request.nextUrl.pathname.startsWith('/signup'))) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/overview'
        return NextResponse.redirect(redirectUrl)
    }

    return supabaseResponse
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
