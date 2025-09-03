import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            global: {
                headers: {
                    'X-Client-Info': 'supabase-js-ssr',
                },
            },
            auth: {
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: false,
            },
            // Disable realtime features that can cause Edge Runtime issues
            realtime: {
                params: {
                    eventsPerSecond: 0,
                },
            },
        }
    )
}
