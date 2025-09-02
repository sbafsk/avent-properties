import { GraphQLError } from 'graphql'
import { Context } from '../context'

export const queryResolvers = {
  Query: {
    // Properties
    properties: async (
      _: unknown,
      { filters = {}, pagination = {} }: {
        filters?: {
          city?: string
          property_type?: string
          min_price?: number
          max_price?: number
          bedrooms?: number
          status?: string
        }
        pagination?: { limit?: number; offset?: number }
      },
      { supabase }: Context
    ) => {
      let query = supabase
        .from('properties')
        .select(`
          *,
          agency:agencies(*)
        `)

      // Apply filters
      if (filters.city) query = query.eq('city', filters.city)
      if (filters.property_type) query = query.eq('property_type', filters.property_type)
      if (filters.min_price) query = query.gte('price', filters.min_price)
      if (filters.max_price) query = query.lte('price', filters.max_price)
      if (filters.bedrooms) query = query.eq('bedrooms', filters.bedrooms)
      if (filters.status) query = query.eq('status', filters.status)

      // Apply pagination
      const limit = Math.min(pagination.limit || 50, 100) // Cap at 100
      const offset = pagination.offset || 0
      query = query.range(offset, offset + limit - 1)

      const { data, error } = await query

      if (error) {
        throw new GraphQLError(`Failed to fetch properties: ${error.message}`)
      }

      return data || []
    },

    property: async (
      _: unknown,
      { id }: { id: string },
      { supabase }: Context
    ) => {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          agency:agencies(*),
          reservations:tour_reservations(
            *,
            user:users(id, name, email)
          )
        `)
        .eq('id', id)
        .single()

      if (error && error.code !== 'PGRST116') { // Not found is ok
        throw new GraphQLError(`Failed to fetch property: ${error.message}`)
      }

      return data
    },

    // Agencies
    agencies: async (_: unknown, __: unknown, { supabase }: Context) => {
      const { data, error } = await supabase
        .from('agencies')
        .select(`
          *,
          properties(id, title, price, city, status)
        `)

      if (error) {
        throw new GraphQLError(`Failed to fetch agencies: ${error.message}`)
      }

      return data || []
    },

    agency: async (
      _: unknown,
      { id }: { id: string },
      { supabase }: Context
    ) => {
      const { data, error } = await supabase
        .from('agencies')
        .select(`
          *,
          properties(*)
        `)
        .eq('id', id)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw new GraphQLError(`Failed to fetch agency: ${error.message}`)
      }

      return data
    },

    // Users
    users: async (_: unknown, __: unknown, { supabase, user }: Context) => {
      // Only admins can list all users
      if (!user || user.role !== 'admin') {
        throw new GraphQLError('Unauthorized')
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')

      if (error) {
        throw new GraphQLError(`Failed to fetch users: ${error.message}`)
      }

      return data || []
    },

    user: async (
      _: unknown,
      { id }: { id: string },
      { supabase, user }: Context
    ) => {
      // Users can only access their own data or admins can access any
      if (!user || (user.id !== id && user.role !== 'admin')) {
        throw new GraphQLError('Unauthorized')
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw new GraphQLError(`Failed to fetch user: ${error.message}`)
      }

      return data
    },

    me: async (_: unknown, __: unknown, { supabase, user }: Context) => {
      if (!user) {
        throw new GraphQLError('Not authenticated')
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        throw new GraphQLError(`Failed to fetch user profile: ${error.message}`)
      }

      return data
    },

    // Reservations
    reservations: async (_: unknown, __: unknown, { supabase, user }: Context) => {
      // Only admins and agents can see all reservations
      if (!user || !['admin', 'agent'].includes(user.role)) {
        throw new GraphQLError('Unauthorized')
      }

      const { data, error } = await supabase
        .from('tour_reservations')
        .select(`
          *,
          user:users(id, name, email),
          property:properties(id, title, city, price)
        `)

      if (error) {
        throw new GraphQLError(`Failed to fetch reservations: ${error.message}`)
      }

      return data || []
    },

    reservation: async (
      _: unknown,
      { id }: { id: string },
      { supabase, user }: Context
    ) => {
      if (!user) {
        throw new GraphQLError('Not authenticated')
      }

      let query = supabase
        .from('tour_reservations')
        .select(`
          *,
          user:users(id, name, email),
          property:properties(id, title, city, price)
        `)
        .eq('id', id)

      // Non-admins can only see their own reservations
      if (user.role !== 'admin') {
        query = query.eq('user_id', user.id)
      }

      const { data, error } = await query.single()

      if (error && error.code !== 'PGRST116') {
        throw new GraphQLError(`Failed to fetch reservation: ${error.message}`)
      }

      return data
    },

    myReservations: async (_: unknown, __: unknown, { supabase, user }: Context) => {
      if (!user) {
        throw new GraphQLError('Not authenticated')
      }

      const { data, error } = await supabase
        .from('tour_reservations')
        .select(`
          *,
          property:properties(id, title, city, price, images)
        `)
        .eq('user_id', user.id)
        .order('scheduled_date', { ascending: true })

      if (error) {
        throw new GraphQLError(`Failed to fetch your reservations: ${error.message}`)
      }

      return data || []
    }
  }
}
