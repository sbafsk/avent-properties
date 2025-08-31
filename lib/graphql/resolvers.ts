import { supabase } from '@/lib/supabase'
import { GraphQLError } from 'graphql'

// Helper function to get authenticated user
async function getAuthenticatedUser(token: string) {
	if (!token) {
		throw new GraphQLError('Authentication required', {
			extensions: { code: 'UNAUTHENTICATED' },
		})
	}

	try {
		const { data: { user }, error } = await supabase.auth.getUser(token)
		if (error || !user) {
			throw new GraphQLError('Invalid token', {
				extensions: { code: 'UNAUTHENTICATED' },
			})
		}
		return user
	} catch {
		throw new GraphQLError('Authentication failed', {
			extensions: { code: 'UNAUTHENTICATED' },
		})
	}
}

export const resolvers = {
	Query: {
		// User queries
		me: async (_, __, { token }) => {
			const user = await getAuthenticatedUser(token)
			const { data, error } = await supabase
				.from('users')
				.select('*')
				.eq('id', user.id)
				.single()

			if (error) throw new GraphQLError('User not found')
			return data
		},

		users: async (_, __, { token }) => {
			await getAuthenticatedUser(token) // Check auth
			const { data, error } = await supabase.from('users').select('*')
			if (error) throw new GraphQLError('Failed to fetch users')
			return data
		},

		user: async (_, { id }, { token }) => {
			await getAuthenticatedUser(token) // Check auth
			const { data, error } = await supabase
				.from('users')
				.select('*')
				.eq('id', id)
				.single()

			if (error) throw new GraphQLError('User not found')
			return data
		},

		// Property queries - Optimized with joins to reduce N+1 queries
		properties: async (_, { city, property_type, min_price, max_price, bedrooms, status, limit = 50, offset = 0 }) => {
			let query = supabase
				.from('properties')
				.select(`
				*,
				agency:agencies(*),
				tour_reservations(*)
			`)

			if (city) query = query.eq('city', city)
			if (property_type) query = query.eq('property_type', property_type)
			if (min_price) query = query.gte('price', min_price)
			if (max_price) query = query.lte('price', max_price)
			if (bedrooms) query = query.eq('bedrooms', bedrooms)
			if (status) query = query.eq('status', status)

			query = query.range(offset, offset + limit - 1)

			const { data, error } = await query
			if (error) throw new GraphQLError('Failed to fetch properties')
			return data
		},

		property: async (_, { id }) => {
			const { data, error } = await supabase
				.from('properties')
				.select(`
				*,
				agency:agencies(*),
				tour_reservations(*)
			`)
				.eq('id', id)
				.single()

			if (error) throw new GraphQLError('Property not found')
			return data
		},

		propertiesByAgency: async (_, { agency_id }) => {
			const { data, error } = await supabase
				.from('properties')
				.select(`
				*,
				agency:agencies(*),
				tour_reservations(*)
			`)
				.eq('agency_id', agency_id)

			if (error) throw new GraphQLError('Failed to fetch agency properties')
			return data
		},

		// Agency queries - Optimized with joins
		agencies: async () => {
			const { data, error } = await supabase
				.from('agencies')
				.select(`
				*,
				properties(*)
			`)
			if (error) throw new GraphQLError('Failed to fetch agencies')
			return data
		},

		agency: async (_, { id }) => {
			const { data, error } = await supabase
				.from('agencies')
				.select(`
				*,
				properties(*)
			`)
				.eq('id', id)
				.single()

			if (error) throw new GraphQLError('Agency not found')
			return data
		},

		// Reservation queries - Optimized with joins
		reservations: async (_, __, { token }) => {
			await getAuthenticatedUser(token) // Check auth
			const { data, error } = await supabase
				.from('tour_reservations')
				.select(`
				*,
				user:users(*),
				property:properties(*)
			`)
			if (error) throw new GraphQLError('Failed to fetch reservations')
			return data
		},

		reservation: async (_, { id }, { token }) => {
			await getAuthenticatedUser(token) // Check auth
			const { data, error } = await supabase
				.from('tour_reservations')
				.select(`
				*,
				user:users(*),
				property:properties(*)
			`)
				.eq('id', id)
				.single()

			if (error) throw new GraphQLError('Reservation not found')
			return data
		},

		userReservations: async (_, { user_id }, { token }) => {
			await getAuthenticatedUser(token) // Check auth
			const { data, error } = await supabase
				.from('tour_reservations')
				.select(`
				*,
				user:users(*),
				property:properties(*)
			`)
				.eq('user_id', user_id)

			if (error) throw new GraphQLError('Failed to fetch user reservations')
			return data
		},

		propertyReservations: async (_, { property_id }) => {
			const { data, error } = await supabase
				.from('tour_reservations')
				.select(`
				*,
				user:users(*),
				property:properties(*)
			`)
				.eq('property_id', property_id)

			if (error) throw new GraphQLError('Failed to fetch property reservations')
			return data
		},

		// Transaction queries
		transactions: async (_, __, { token }) => {
			await getAuthenticatedUser(token) // Check auth
			const { data, error } = await supabase.from('transactions').select('*')
			if (error) throw new GraphQLError('Failed to fetch transactions')
			return data
		},

		transaction: async (_, { id }, { token }) => {
			await getAuthenticatedUser(token) // Check auth
			const { data, error } = await supabase
				.from('transactions')
				.select('*')
				.eq('id', id)
				.single()

			if (error) throw new GraphQLError('Transaction not found')
			return data
		},

		userTransactions: async (_, { user_id }, { token }) => {
			await getAuthenticatedUser(token) // Check auth
			const { data, error } = await supabase
				.from('transactions')
				.select('*')
				.eq('user_id', user_id)

			if (error) throw new GraphQLError('Failed to fetch user transactions')
			return data
		},

		// Contact queries
		contactRequests: async (_, __, { token }) => {
			await getAuthenticatedUser(token) // Check auth
			const { data, error } = await supabase.from('contact_requests').select('*')
			if (error) throw new GraphQLError('Failed to fetch contact requests')
			return data
		},

		contactRequest: async (_, { id }, { token }) => {
			await getAuthenticatedUser(token) // Check auth
			const { data, error } = await supabase
				.from('contact_requests')
				.select('*')
				.eq('id', id)
				.single()

			if (error) throw new GraphQLError('Contact request not found')
			return data
		},
	},

	Mutation: {
		// User mutations
		createUser: async (_, { input }, { token }) => {
			await getAuthenticatedUser(token) // Check auth
			const { data, error } = await supabase
				.from('users')
				.insert([input])
				.select()
				.single()

			if (error) throw new GraphQLError('Failed to create user')
			return data
		},

		updateUser: async (_, { id, input }, { token }) => {
			await getAuthenticatedUser(token) // Check auth
			const { data, error } = await supabase
				.from('users')
				.update(input)
				.eq('id', id)
				.select()
				.single()

			if (error) throw new GraphQLError('Failed to update user')
			return data
		},

		deleteUser: async (_, { id }, { token }) => {
			await getAuthenticatedUser(token) // Check auth
			const { error } = await supabase.from('users').delete().eq('id', id)
			if (error) throw new GraphQLError('Failed to delete user')
			return true
		},

		// Property mutations
		createProperty: async (_, { input }, { token }) => {
			await getAuthenticatedUser(token) // Check auth
			const { data, error } = await supabase
				.from('properties')
				.insert([input])
				.select()
				.single()

			if (error) throw new GraphQLError('Failed to create property')
			return data
		},

		updateProperty: async (_, { id, input }, { token }) => {
			await getAuthenticatedUser(token) // Check auth
			const { data, error } = await supabase
				.from('properties')
				.update(input)
				.eq('id', id)
				.select()
				.single()

			if (error) throw new GraphQLError('Failed to update property')
			return data
		},

		deleteProperty: async (_, { id }, { token }) => {
			await getAuthenticatedUser(token) // Check auth
			const { error } = await supabase.from('properties').delete().eq('id', id)
			if (error) throw new GraphQLError('Failed to delete property')
			return true
		},

		// Agency mutations
		createAgency: async (_, { input }, { token }) => {
			await getAuthenticatedUser(token) // Check auth
			const { data, error } = await supabase
				.from('agencies')
				.insert([input])
				.select()
				.single()

			if (error) throw new GraphQLError('Failed to create agency')
			return data
		},

		updateAgency: async (_, { id, input }, { token }) => {
			await getAuthenticatedUser(token) // Check auth
			const { data, error } = await supabase
				.from('agencies')
				.update(input)
				.eq('id', id)
				.select()
				.single()

			if (error) throw new GraphQLError('Failed to update agency')
			return data
		},

		deleteAgency: async (_, { id }, { token }) => {
			await getAuthenticatedUser(token) // Check auth
			const { error } = await supabase.from('agencies').delete().eq('id', id)
			if (error) throw new GraphQLError('Failed to delete agency')
			return true
		},

		// Reservation mutations
		createReservation: async (_, { input }, { token }) => {
			const user = await getAuthenticatedUser(token)
			const { data, error } = await supabase
				.from('tour_reservations')
				.insert([{ ...input, user_id: user.id }])
				.select()
				.single()

			if (error) throw new GraphQLError('Failed to create reservation')
			return data
		},

		updateReservation: async (_, { id, input }, { token }) => {
			await getAuthenticatedUser(token) // Check auth
			const { data, error } = await supabase
				.from('tour_reservations')
				.update(input)
				.eq('id', id)
				.select()
				.single()

			if (error) throw new GraphQLError('Failed to update reservation')
			return data
		},

		cancelReservation: async (_, { id }, { token }) => {
			await getAuthenticatedUser(token) // Check auth
			const { data, error } = await supabase
				.from('tour_reservations')
				.update({ status: 'cancelled' })
				.eq('id', id)
				.select()
				.single()

			if (error) throw new GraphQLError('Failed to cancel reservation')
			return data
		},

		// Transaction mutations
		createTransaction: async (_, { input }, { token }) => {
			await getAuthenticatedUser(token) // Check auth
			const { data, error } = await supabase
				.from('transactions')
				.insert([input])
				.select()
				.single()

			if (error) throw new GraphQLError('Failed to create transaction')
			return data
		},

		updateTransaction: async (_, { id, input }, { token }) => {
			await getAuthenticatedUser(token) // Check auth
			const { data, error } = await supabase
				.from('transactions')
				.update(input)
				.eq('id', id)
				.select()
				.single()

			if (error) throw new GraphQLError('Failed to update transaction')
			return data
		},

		// Contact mutations
		createContactRequest: async (_, { input }) => {
			const { data, error } = await supabase
				.from('contact_requests')
				.insert([{ ...input, status: 'NEW' }])
				.select()
				.single()

			if (error) throw new GraphQLError('Failed to create contact request')
			return data
		},

		updateContactRequest: async (_, { id, input }, { token }) => {
			await getAuthenticatedUser(token) // Check auth
			const { data, error } = await supabase
				.from('contact_requests')
				.update(input)
				.eq('id', id)
				.select()
				.single()

			if (error) throw new GraphQLError('Failed to update contact request')
			return data
		},
	},

	// Field resolvers for relationships - Optimized to avoid N+1 queries
	// These resolvers now just return the data that was already fetched in the main queries
	Property: {
		agency: (parent) => parent.agency,
		reservations: (parent) => parent.tour_reservations || [],
	},

	Agency: {
		properties: (parent) => parent.properties || [],
	},

	User: {
		reservations: (parent) => parent.reservations || [],
	},

	TourReservation: {
		user: (parent) => parent.user,
		property: (parent) => parent.property,
	},
}
