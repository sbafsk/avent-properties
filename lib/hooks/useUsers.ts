import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSupabaseGraphQLClient } from '@/lib/supabase/graphql-client'
import { gql } from 'graphql-request'
import type {
    User,
    CreateUserInput,
    UpdateUserInput,
    SupabaseGraphQLResponse,
    SupabaseMutationResponse,
} from '@/lib/types/graphql'

// GraphQL Queries for Users
const GET_USERS_QUERY = gql`
	query GetUsers($first: Int, $offset: Int, $orderBy: [usersOrderBy!]) {
		usersCollection(first: $first, offset: $offset, orderBy: $orderBy) {
			edges {
				node {
					id
					email
					name
					role
					created_at
					updated_at
					tour_reservationsCollection {
						edges {
							node {
								id
								scheduled_date
								deposit_amount
								status
								property_id
							}
						}
					}
					transactionsCollection {
						edges {
							node {
								id
								amount
								type
								status
								created_at
							}
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

const GET_USER_QUERY = gql`
	query GetUser($id: UUID!) {
		usersCollection(filter: { id: { eq: $id } }) {
			edges {
				node {
					id
					email
					name
					role
					created_at
					updated_at
					tour_reservationsCollection {
						edges {
							node {
								id
								scheduled_date
								deposit_amount
								status
								property_id
								property {
									id
									title
									price
									city
								}
							}
						}
					}
					transactionsCollection {
						edges {
							node {
								id
								amount
								type
								status
								reservation_id
								created_at
							}
						}
					}
				}
			}
		}
	}
`

// GraphQL Mutations for Users
const CREATE_USER_MUTATION = gql`
	mutation CreateUser($input: usersInsertInput!) {
		insertIntousersCollection(objects: [$input]) {
			affectedCount
			records {
				id
				email
				name
				role
				created_at
				updated_at
			}
		}
	}
`

const UPDATE_USER_MUTATION = gql`
	mutation UpdateUser($id: UUID!, $input: usersUpdateInput!) {
		updateusersCollection(filter: { id: { eq: $id } }, set: $input) {
			affectedCount
			records {
				id
				email
				name
				role
				created_at
				updated_at
			}
		}
	}
`

const DELETE_USER_MUTATION = gql`
	mutation DeleteUser($id: UUID!) {
		deleteFromusersCollection(filter: { id: { eq: $id } }) {
			affectedCount
		}
	}
`

// Custom hook for users
export function useUsers() {
    const queryClient = useQueryClient()

    // Fetch users
    const getUsersQuery = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const client = await getSupabaseGraphQLClient()
            const data = await client.request(GET_USERS_QUERY, {
                first: 100,
                offset: 0,
                orderBy: [{ created_at: 'DescNullsLast' }],
            }) as SupabaseGraphQLResponse<User>
            return data.usersCollection.edges.map((edge) => edge.node)
        },
        staleTime: 10 * 60 * 1000, // 10 minutes
    })

    // Create user
    const createUserMutation = useMutation({
        mutationFn: async (input: CreateUserInput) => {
            const client = await getSupabaseGraphQLClient()
            const data = await client.request(CREATE_USER_MUTATION, { input }) as SupabaseMutationResponse<User>
            return data.insertIntousersCollection.records[0]
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
    })

    // Update user
    const updateUserMutation = useMutation({
        mutationFn: async ({ id, input }: { id: string; input: UpdateUserInput }) => {
            const client = await getSupabaseGraphQLClient()
            const data = await client.request(UPDATE_USER_MUTATION, { id, input }) as SupabaseMutationResponse<User>
            return data.updateusersCollection.records[0]
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
    })

    // Delete user
    const deleteUserMutation = useMutation({
        mutationFn: async (id: string) => {
            const client = await getSupabaseGraphQLClient()
            await client.request(DELETE_USER_MUTATION, { id })
            return id
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
    })

    return {
        users: getUsersQuery.data || [],
        isLoading: getUsersQuery.isLoading,
        isError: getUsersQuery.isError,
        error: getUsersQuery.error,
        refetch: getUsersQuery.refetch,
        createUser: createUserMutation.mutate,
        updateUser: updateUserMutation.mutate,
        deleteUser: deleteUserMutation.mutate,
        isCreating: createUserMutation.isPending,
        isUpdating: updateUserMutation.isPending,
        isDeleting: deleteUserMutation.isPending,
    }
}

// Custom hook for single user
export function useUser(id: string) {
    const getUserQuery = useQuery({
        queryKey: ['user', id],
        queryFn: async () => {
            if (!id) return null
            const client = await getSupabaseGraphQLClient()
            const data = await client.request(GET_USER_QUERY, { id }) as SupabaseGraphQLResponse<User>
            return data.usersCollection.edges[0]?.node || null
        },
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })

    return {
        user: getUserQuery.data,
        isLoading: getUserQuery.isLoading,
        isError: getUserQuery.isError,
        error: getUserQuery.error,
        refetch: getUserQuery.refetch,
    }
}
