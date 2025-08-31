'use client'

import { Provider } from 'react-redux'
import { ApolloProvider } from '@apollo/client/react'
import { store } from '@/lib/store'
import { client } from '@/lib/apollo-client'
import { QueryProvider } from '@/lib/providers/QueryProvider'

interface ProvidersProps {
	children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
	return (
		<Provider store={store}>
			<QueryProvider>
				<ApolloProvider client={client}>{children}</ApolloProvider>
			</QueryProvider>
		</Provider>
	)
}
