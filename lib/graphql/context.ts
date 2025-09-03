import { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'
import { Database } from '../database.types'
import { NextRequest } from 'next/server'

export interface Context {
  supabase: SupabaseClient<Database>
  user?: {
    id: string
    role: string
    email: string
  }
}

export async function createContext({ req }: { req: NextRequest }): Promise<Context> {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')

  // Create Supabase client
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      global: {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      }
    }
  )

  // Get user from token if provided
  let user: Context['user'] = undefined
  if (token) {
    const { data: { user: authUser }, error } = await supabase.auth.getUser(token)
    if (!error && authUser) {
      user = {
        id: authUser.id,
        role: authUser.user_metadata?.role || 'user',
        email: authUser.email!
      }
    }
  }

  return { supabase, user }
}
