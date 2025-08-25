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
						merge(existing = [], incoming) {
							return incoming
						},
					},
					tourReservations: {
						merge(existing = [], incoming) {
							return incoming
						},
					},
				},
			},
		},
	}),
	defaultOptions: {
		watchQuery: {
			errorPolicy: 'all',
		},
		query: {
			errorPolicy: 'all',
		},
	},
})
