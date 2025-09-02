import { GraphQLError } from 'graphql'
import { Context } from '../context'
import { Database } from '../../database.types'

export const mutationResolvers = {
  Mutation: {
    createReservation: async (
      _: unknown,
      { input }: {
        input: {
          property_id: string
          scheduled_date: string
          deposit_amount: number
        }
      },
      { supabase, user }: Context
    ) => {
      if (!user) {
        throw new GraphQLError('Authentication required')
      }

      // Business logic validation
      const scheduledDate = new Date(input.scheduled_date)
      const now = new Date()

      if (scheduledDate <= now) {
        throw new GraphQLError('Scheduled date must be in the future')
      }

      // Check if property exists and is available
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .select('id, status, title')
        .eq('id', input.property_id)
        .single()

      if (propertyError) {
        throw new GraphQLError('Property not found')
      }

      if (property.status !== 'available') {
        throw new GraphQLError('Property is not available for reservation')
      }

      // Check for existing reservations on the same date
      const { data: existingReservation } = await supabase
        .from('tour_reservations')
        .select('id')
        .eq('property_id', input.property_id)
        .eq('scheduled_date', input.scheduled_date)
        .eq('status', 'confirmed')
        .single()

      if (existingReservation) {
        throw new GraphQLError('This time slot is already reserved')
      }

      // Create reservation
      const { data, error } = await supabase
        .from('tour_reservations')
        .insert({
          user_id: user.id,
          property_id: input.property_id,
          scheduled_date: input.scheduled_date,
          deposit_amount: input.deposit_amount,
          status: 'pending'
        })
        .select(`
          *,
          user:users(id, name, email),
          property:properties(id, title, city, price)
        `)
        .single()

      if (error) {
        throw new GraphQLError(`Failed to create reservation: ${error.message}`)
      }

      return data
    },

    updateReservation: async (
      _: unknown,
      { input }: {
        input: {
          id: string
          scheduled_date?: string
          deposit_amount?: number
          status?: string
        }
      },
      { supabase, user }: Context
    ) => {
      if (!user) {
        throw new GraphQLError('Authentication required')
      }

      // Check ownership or admin rights
      const { data: existingReservation, error: fetchError } = await supabase
        .from('tour_reservations')
        .select('user_id, status')
        .eq('id', input.id)
        .single()

      if (fetchError) {
        throw new GraphQLError('Reservation not found')
      }

      if (user.role !== 'admin' && existingReservation.user_id !== user.id) {
        throw new GraphQLError('Unauthorized to update this reservation')
      }

      // Prepare update data
      const updateData: Partial<Database['public']['Tables']['tour_reservations']['Update']> = {}
      if (input.scheduled_date) {
        const scheduledDate = new Date(input.scheduled_date)
        if (scheduledDate <= new Date()) {
          throw new GraphQLError('Scheduled date must be in the future')
        }
        updateData.scheduled_date = input.scheduled_date
      }
      if (input.deposit_amount) updateData.deposit_amount = input.deposit_amount
      if (input.status) updateData.status = input.status

      const { data, error } = await supabase
        .from('tour_reservations')
        .update(updateData)
        .eq('id', input.id)
        .select(`
          *,
          user:users(id, name, email),
          property:properties(id, title, city, price)
        `)
        .single()

      if (error) {
        throw new GraphQLError(`Failed to update reservation: ${error.message}`)
      }

      return data
    },

    cancelReservation: async (
      _: unknown,
      { id }: { id: string },
      { supabase, user }: Context
    ) => {
      if (!user) {
        throw new GraphQLError('Authentication required')
      }

      // Check ownership or admin rights
      const { data: existingReservation, error: fetchError } = await supabase
        .from('tour_reservations')
        .select('user_id, status, scheduled_date')
        .eq('id', id)
        .single()

      if (fetchError) {
        throw new GraphQLError('Reservation not found')
      }

      if (user.role !== 'admin' && existingReservation.user_id !== user.id) {
        throw new GraphQLError('Unauthorized to cancel this reservation')
      }

      if (existingReservation.status === 'cancelled') {
        throw new GraphQLError('Reservation is already cancelled')
      }

      // Check if cancellation is allowed (e.g., not too close to scheduled date)
      const scheduledDate = new Date(existingReservation.scheduled_date)
      const now = new Date()
      const hoursUntilReservation = (scheduledDate.getTime() - now.getTime()) / (1000 * 60 * 60)

      if (hoursUntilReservation < 24 && user.role !== 'admin') {
        throw new GraphQLError('Cannot cancel reservation less than 24 hours before scheduled time')
      }

      const { data, error } = await supabase
        .from('tour_reservations')
        .update({ status: 'cancelled' })
        .eq('id', id)
        .select(`
          *,
          user:users(id, name, email),
          property:properties(id, title, city, price)
        `)
        .single()

      if (error) {
        throw new GraphQLError(`Failed to cancel reservation: ${error.message}`)
      }

      return data
    },

    // Property mutations (Admin only)
    createProperty: async (
      _: unknown,
      { input }: {
        input: {
          title: string
          description: string
          price: number
          currency: string
          city: string
          neighborhood?: string
          property_type: string
          bedrooms: number
          bathrooms: number
          area_m2: number
          amenities: string[]
          images: string[]
          status: string
          agency_id: string
        }
      },
      { supabase, user }: Context
    ) => {
      if (!user || user.role !== 'admin') {
        throw new GraphQLError('Admin access required')
      }

      const { data, error } = await supabase
        .from('properties')
        .insert(input)
        .select(`
          *,
          agency:agencies(*)
        `)
        .single()

      if (error) {
        throw new GraphQLError(`Failed to create property: ${error.message}`)
      }

      return data
    },

    updateProperty: async (
      _: unknown,
      { input }: {
        input: {
          id: string
          title?: string
          description?: string
          price?: number
          currency?: string
          city?: string
          neighborhood?: string
          property_type?: string
          bedrooms?: number
          bathrooms?: number
          area_m2?: number
          amenities?: string[]
          images?: string[]
          status?: string
          agency_id?: string
        }
      },
      { supabase, user }: Context
    ) => {
      if (!user || user.role !== 'admin') {
        throw new GraphQLError('Admin access required')
      }

      const { id, ...updateData } = input

      const { data, error } = await supabase
        .from('properties')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          agency:agencies(*)
        `)
        .single()

      if (error) {
        throw new GraphQLError(`Failed to update property: ${error.message}`)
      }

      return data
    },

    deleteProperty: async (
      _: unknown,
      { id }: { id: string },
      { supabase, user }: Context
    ) => {
      if (!user || user.role !== 'admin') {
        throw new GraphQLError('Admin access required')
      }

      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id)

      if (error) {
        throw new GraphQLError(`Failed to delete property: ${error.message}`)
      }

      return true
    }
  }
}
