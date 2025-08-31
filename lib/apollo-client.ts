import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const httpLink = createHttpLink({
	uri: process.env.NEXT_PUBLIC_APP_URL + '/api/graphql',
})

const authLink = setContext(async (_, { headers }) => {
	// Get the authentication token from local storage if it exists
	const token = typeof window !== 'undefined' ? localStorage.getItem('supabase.auth.token') : null

	// Return the headers to the context so httpLink can read them
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : '',
		},
	}
})

export const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache({
		typePolicies: {
			Query: {
				fields: {
					properties: {
						merge(_, incoming) {
							return incoming
						},
					},
					tourReservations: {
						merge(_, incoming) {
							return incoming
						},
					},
					agencies: {
						merge(_, incoming) {
							return incoming
						},
					},
					users: {
						merge(_, incoming) {
							return incoming
						},
					},
				},
			},
			Property: {
				fields: {
					agency: {
						merge: true,
					},
					reservations: {
						merge: false,
					},
				},
			},
			Agency: {
				fields: {
					properties: {
						merge: false,
					},
				},
			},
			TourReservation: {
				fields: {
					user: {
						merge: true,
					},
					property: {
						merge: true,
					},
				},
			},
		},
	}),
	defaultOptions: {
		watchQuery: {
			errorPolicy: 'all',
			fetchPolicy: 'cache-and-network',
		},
		query: {
			errorPolicy: 'all',
			fetchPolicy: 'cache-first',
		},
	},
})
