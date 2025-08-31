import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSupabaseGraphQLClient } from '@/lib/supabase/graphql-client'
import { gql } from 'graphql-request'
import type {
    TourReservation,
    CreateReservationInput,
    UpdateReservationInput,
    SupabaseGraphQLResponse,
    SupabaseMutationResponse,
} from '@/lib/types/graphql'

// GraphQL Queries for Reservations
const GET_RESERVATIONS_QUERY = gql`
	query GetReservations($first: Int, $offset: Int, $orderBy: [tour_reservationsOrderBy!]) {
		tour_reservationsCollection(first: $first, offset: $offset, orderBy: $orderBy) {
			edges {
				node {
					id
					user_id
					property_id
					scheduled_date
					deposit_amount
					status
					created_at
					updated_at
					user {
						id
						name
						email
						role
					}
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
			pageInfo {
				hasNextPage
				hasPreviousPage
				startCursor
				endCursor
			}
		}
	}
`

const GET_RESERVATION_QUERY = gql`
	query GetReservation($id: UUID!) {
		tour_reservationsCollection(filter: { id: { eq: $id } }) {
			edges {
				node {
					id
					user_id
					property_id
					scheduled_date
					deposit_amount
					status
					created_at
					updated_at
					user {
						id
						name
						email
						role
					}
					property {
						id
						title
						description
						price
						currency
						city
						neighborhood
						property_type
						bedrooms
						bathrooms
						area_m2
						amenities
						images
						status
						agency {
							id
							name
							email
							phone
							address
						}
					}
				}
			}
		}
	}
`

const GET_USER_RESERVATIONS_QUERY = gql`
	query GetUserReservations($user_id: UUID!) {
		tour_reservationsCollection(filter: { user_id: { eq: $user_id } }, orderBy: [{ scheduled_date: 'DescNullsLast' }]) {
			edges {
				node {
					id
					user_id
					property_id
					scheduled_date
					deposit_amount
					status
					created_at
					updated_at
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
`

const GET_PROPERTY_RESERVATIONS_QUERY = gql`
	query GetPropertyReservations($property_id: UUID!) {
		tour_reservationsCollection(filter: { property_id: { eq: $property_id } }, orderBy: [{ scheduled_date: 'DescNullsLast' }]) {
			edges {
				node {
					id
					user_id
					property_id
					scheduled_date
					deposit_amount
					status
					created_at
					updated_at
					user {
						id
						name
						email
					}
				}
			}
		}
	}
`

// GraphQL Mutations for Reservations
const CREATE_RESERVATION_MUTATION = gql`
	mutation CreateReservation($input: tour_reservationsInsertInput!) {
		insertIntotour_reservationsCollection(objects: [$input]) {
			affectedCount
			records {
				id
				user_id
				property_id
				scheduled_date
				deposit_amount
				status
				created_at
				updated_at
			}
		}
	}
`

const UPDATE_RESERVATION_MUTATION = gql`
	mutation UpdateReservation($id: UUID!, $input: tour_reservationsUpdateInput!) {
		updatetour_reservationsCollection(filter: { id: { eq: $id } }, set: $input) {
			affectedCount
			records {
				id
				user_id
				property_id
				scheduled_date
				deposit_amount
				status
				created_at
				updated_at
			}
		}
	}
`

const CANCEL_RESERVATION_MUTATION = gql`
	mutation CancelReservation($id: UUID!) {
		updatetour_reservationsCollection(filter: { id: { eq: $id } }, set: { status: "CANCELLED" }) {
			affectedCount
			records {
				id
				status
			}
		}
	}
`

const DELETE_RESERVATION_MUTATION = gql`
	mutation DeleteReservation($id: UUID!) {
		deleteFromtour_reservationsCollection(filter: { id: { eq: $id } }) {
			affectedCount
		}
	}
`

// Custom hook for reservations
export function useReservations() {
    const queryClient = useQueryClient()

    // Fetch reservations
    const getReservationsQuery = useQuery({
        queryKey: ['reservations'],
        queryFn: async () => {
            const client = await getSupabaseGraphQLClient()
            const data = await client.request(GET_RESERVATIONS_QUERY, {
                first: 100,
                offset: 0,
                orderBy: [{ scheduled_date: 'DescNullsLast' }],
            }) as SupabaseGraphQLResponse<TourReservation>
            return data.tour_reservationsCollection.edges.map((edge) => edge.node)
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    })

    // Create reservation
    const createReservationMutation = useMutation({
        mutationFn: async (input: CreateReservationInput) => {
            const client = await getSupabaseGraphQLClient()
            const data = await client.request(CREATE_RESERVATION_MUTATION, { input }) as SupabaseMutationResponse<TourReservation>
            return data.insertIntotour_reservationsCollection.records[0]
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reservations'] })
        },
    })

    // Update reservation
    const updateReservationMutation = useMutation({
        mutationFn: async ({ id, input }: { id: string; input: UpdateReservationInput }) => {
            const client = await getSupabaseGraphQLClient()
            const data = await client.request(UPDATE_RESERVATION_MUTATION, { id, input }) as SupabaseMutationResponse<TourReservation>
            return data.updatetour_reservationsCollection.records[0]
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reservations'] })
        },
    })

    // Cancel reservation
    const cancelReservationMutation = useMutation({
        mutationFn: async (id: string) => {
            const client = await getSupabaseGraphQLClient()
            const data = await client.request(CANCEL_RESERVATION_MUTATION, { id }) as SupabaseMutationResponse<TourReservation>
            return data.updatetour_reservationsCollection.records[0]
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reservations'] })
        },
    })

    // Delete reservation
    const deleteReservationMutation = useMutation({
        mutationFn: async (id: string) => {
            const client = await getSupabaseGraphQLClient()
            await client.request(DELETE_RESERVATION_MUTATION, { id })
            return id
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reservations'] })
        },
    })

    return {
        reservations: getReservationsQuery.data || [],
        isLoading: getReservationsQuery.isLoading,
        isError: getReservationsQuery.isError,
        error: getReservationsQuery.error,
        refetch: getReservationsQuery.refetch,
        createReservation: createReservationMutation.mutate,
        updateReservation: updateReservationMutation.mutate,
        cancelReservation: cancelReservationMutation.mutate,
        deleteReservation: deleteReservationMutation.mutate,
        isCreating: createReservationMutation.isPending,
        isUpdating: updateReservationMutation.isPending,
        isCancelling: cancelReservationMutation.isPending,
        isDeleting: deleteReservationMutation.isPending,
    }
}

// Custom hook for single reservation
export function useReservation(id: string) {
    const getReservationQuery = useQuery({
        queryKey: ['reservation', id],
        queryFn: async () => {
            if (!id) return null
            const client = await getSupabaseGraphQLClient()
            const data = await client.request(GET_RESERVATION_QUERY, { id }) as SupabaseGraphQLResponse<TourReservation>
            return data.tour_reservationsCollection.edges[0]?.node || null
        },
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })

    return {
        reservation: getReservationQuery.data,
        isLoading: getReservationQuery.isLoading,
        isError: getReservationQuery.isError,
        error: getReservationQuery.error,
        refetch: getReservationQuery.refetch,
    }
}

// Custom hook for user reservations
export function useUserReservations(userId: string) {
    const getUserReservationsQuery = useQuery({
        queryKey: ['userReservations', userId],
        queryFn: async () => {
            if (!userId) return []
            const client = await getSupabaseGraphQLClient()
            const data = await client.request(GET_USER_RESERVATIONS_QUERY, { user_id: userId }) as SupabaseGraphQLResponse<TourReservation>
            return data.tour_reservationsCollection.edges.map((edge) => edge.node)
        },
        enabled: !!userId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })

    return {
        reservations: getUserReservationsQuery.data || [],
        isLoading: getUserReservationsQuery.isLoading,
        isError: getUserReservationsQuery.isError,
        error: getUserReservationsQuery.error,
        refetch: getUserReservationsQuery.refetch,
    }
}

// Custom hook for property reservations
export function usePropertyReservations(propertyId: string) {
    const getPropertyReservationsQuery = useQuery({
        queryKey: ['propertyReservations', propertyId],
        queryFn: async () => {
            if (!propertyId) return []
            const client = await getSupabaseGraphQLClient()
            const data = await client.request(GET_PROPERTY_RESERVATIONS_QUERY, { property_id: propertyId }) as SupabaseGraphQLResponse<TourReservation>
            return data.tour_reservationsCollection.edges.map((edge) => edge.node)
        },
        enabled: !!propertyId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })

    return {
        reservations: getPropertyReservationsQuery.data || [],
        isLoading: getPropertyReservationsQuery.isLoading,
        isError: getPropertyReservationsQuery.isError,
        error: getPropertyReservationsQuery.error,
        refetch: getPropertyReservationsQuery.refetch,
    }
}
