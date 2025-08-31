import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSupabaseGraphQLClient } from '@/lib/supabase/graphql-client'
import { gql } from 'graphql-request'
import type {
    Transaction,
    CreateTransactionInput,
    UpdateTransactionInput,
    SupabaseGraphQLResponse,
    SupabaseMutationResponse,
} from '@/lib/types/graphql'

// GraphQL Queries for Transactions
const GET_TRANSACTIONS_QUERY = gql`
	query GetTransactions($first: Int, $offset: Int, $orderBy: [transactionsOrderBy!]) {
		transactionsCollection(first: $first, offset: $offset, orderBy: $orderBy) {
			edges {
				node {
					id
					amount
					type
					status
					reservation_id
					user_id
					created_at
					updated_at
					user {
						id
						name
						email
					}
					reservation {
						id
						scheduled_date
						property {
							id
							title
							city
						}
					}
				}
			}
			pageInfo {
				hasNextPage
				hasPreviousPage
				startCursor
				endCursor
			}
		}
	}
`

const GET_TRANSACTION_QUERY = gql`
	query GetTransaction($id: UUID!) {
		transactionsCollection(filter: { id: { eq: $id } }) {
			edges {
				node {
					id
					amount
					type
					status
					reservation_id
					user_id
					created_at
					updated_at
					user {
						id
						name
						email
						role
					}
					reservation {
						id
						scheduled_date
						deposit_amount
						status
						property {
							id
							title
							price
							city
							agency {
								id
								name
							}
						}
					}
				}
			}
		}
	}
`

const GET_USER_TRANSACTIONS_QUERY = gql`
	query GetUserTransactions($user_id: UUID!) {
		transactionsCollection(filter: { user_id: { eq: $user_id } }, orderBy: [{ created_at: 'DescNullsLast' }]) {
			edges {
				node {
					id
					amount
					type
					status
					reservation_id
					user_id
					created_at
					updated_at
					reservation {
						id
						scheduled_date
						property {
							id
							title
							city
						}
					}
				}
			}
		}
	}
`

// GraphQL Mutations for Transactions
const CREATE_TRANSACTION_MUTATION = gql`
	mutation CreateTransaction($input: transactionsInsertInput!) {
		insertIntotransactionsCollection(objects: [$input]) {
			affectedCount
			records {
				id
				amount
				type
				status
				reservation_id
				user_id
				created_at
				updated_at
			}
		}
	}
`

const UPDATE_TRANSACTION_MUTATION = gql`
	mutation UpdateTransaction($id: UUID!, $input: transactionsUpdateInput!) {
		updatetransactionsCollection(filter: { id: { eq: $id } }, set: $input) {
			affectedCount
			records {
				id
				amount
				type
				status
				reservation_id
				user_id
				created_at
				updated_at
			}
		}
	}
`

const DELETE_TRANSACTION_MUTATION = gql`
	mutation DeleteTransaction($id: UUID!) {
		deleteFromtransactionsCollection(filter: { id: { eq: $id } }) {
			affectedCount
		}
	}
`

// Custom hook for transactions
export function useTransactions() {
    const queryClient = useQueryClient()

    // Fetch transactions
    const getTransactionsQuery = useQuery({
        queryKey: ['transactions'],
        queryFn: async () => {
            const client = await getSupabaseGraphQLClient()
            const data = await client.request(GET_TRANSACTIONS_QUERY, {
                first: 100,
                offset: 0,
                orderBy: [{ created_at: 'DescNullsLast' }],
            }) as SupabaseGraphQLResponse<Transaction>
            return data.transactionsCollection.edges.map((edge) => edge.node)
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    })

    // Create transaction
    const createTransactionMutation = useMutation({
        mutationFn: async (input: CreateTransactionInput) => {
            const client = await getSupabaseGraphQLClient()
            const data = await client.request(CREATE_TRANSACTION_MUTATION, { input }) as SupabaseMutationResponse<Transaction>
            return data.insertIntotransactionsCollection.records[0]
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] })
        },
    })

    // Update transaction
    const updateTransactionMutation = useMutation({
        mutationFn: async ({ id, input }: { id: string; input: UpdateTransactionInput }) => {
            const client = await getSupabaseGraphQLClient()
            const data = await client.request(UPDATE_TRANSACTION_MUTATION, { id, input }) as SupabaseMutationResponse<Transaction>
            return data.updatetransactionsCollection.records[0]
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] })
        },
    })

    // Delete transaction
    const deleteTransactionMutation = useMutation({
        mutationFn: async (id: string) => {
            const client = await getSupabaseGraphQLClient()
            await client.request(DELETE_TRANSACTION_MUTATION, { id })
            return id
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] })
        },
    })

    return {
        transactions: getTransactionsQuery.data || [],
        isLoading: getTransactionsQuery.isLoading,
        isError: getTransactionsQuery.isError,
        error: getTransactionsQuery.error,
        refetch: getTransactionsQuery.refetch,
        createTransaction: createTransactionMutation.mutate,
        updateTransaction: updateTransactionMutation.mutate,
        deleteTransaction: deleteTransactionMutation.mutate,
        isCreating: createTransactionMutation.isPending,
        isUpdating: updateTransactionMutation.isPending,
        isDeleting: deleteTransactionMutation.isPending,
    }
}

// Custom hook for single transaction
export function useTransaction(id: string) {
    const getTransactionQuery = useQuery({
        queryKey: ['transaction', id],
        queryFn: async () => {
            if (!id) return null
            const client = await getSupabaseGraphQLClient()
            const data = await client.request(GET_TRANSACTION_QUERY, { id }) as SupabaseGraphQLResponse<Transaction>
            return data.transactionsCollection.edges[0]?.node || null
        },
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })

    return {
        transaction: getTransactionQuery.data,
        isLoading: getTransactionQuery.isLoading,
        isError: getTransactionQuery.isError,
        error: getTransactionQuery.error,
        refetch: getTransactionQuery.refetch,
    }
}

// Custom hook for user transactions
export function useUserTransactions(userId: string) {
    const getUserTransactionsQuery = useQuery({
        queryKey: ['userTransactions', userId],
        queryFn: async () => {
            if (!userId) return []
            const client = await getSupabaseGraphQLClient()
            const data = await client.request(GET_USER_TRANSACTIONS_QUERY, { user_id: userId }) as SupabaseGraphQLResponse<Transaction>
            return data.transactionsCollection.edges.map((edge) => edge.node)
        },
        enabled: !!userId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })

    return {
        transactions: getUserTransactionsQuery.data || [],
        isLoading: getUserTransactionsQuery.isLoading,
        isError: getUserTransactionsQuery.isError,
        error: getUserTransactionsQuery.error,
        refetch: getUserTransactionsQuery.refetch,
    }
}
