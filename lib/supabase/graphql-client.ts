import { GraphQLClient } from 'graphql-request'
import { createClient } from './client'

const endpoint = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/graphql/v1`

// Create a client that adds the Authorization header with the JWT
export const getSupabaseGraphQLClient = async () => {
    const supabase = createClient()
    const { data } = await supabase.auth.getSession()
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    }

    if (data?.session) {
        headers.authorization = `Bearer ${data.session.access_token}`
    }

    return new GraphQLClient(endpoint, { headers })
}

// For server-side usage (in API routes)
export const getSupabaseGraphQLClientServer = async (token?: string) => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    }

    if (token) {
        headers.authorization = `Bearer ${token}`
    }

    return new GraphQLClient(endpoint, { headers })
}
