'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export function QueryProvider({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						// With SSR, we usually want to set some default staleTime
						// above 0 to avoid refetching immediately on the client
						staleTime: 60 * 1000, // 1 minute
					retry: (failureCount, error) => {
						// Don't retry on 4xx errors
						if (error && typeof error === 'object' && 'status' in error) {
							const status = (error as { status: number }).status
							if (status >= 400 && status < 500) {
								return false
							}
						}
						// Retry up to 3 times for other errors
						return failureCount < 3
					},
					},
					mutations: {
						retry: false,
					},
				},
			})
	)

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	)
}
