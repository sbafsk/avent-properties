'use client'

import { Provider } from 'react-redux'
import { ApolloProvider } from '@apollo/client/react'
import { store } from '@/lib/store'
import { client } from '@/lib/apollo-client'

interface ProvidersProps {
	children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
	return (
		<Provider store={store}>
			<ApolloProvider client={client}>{children}</ApolloProvider>
		</Provider>
	)
}
