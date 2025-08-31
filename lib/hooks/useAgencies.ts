import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSupabaseGraphQLClient } from '@/lib/supabase/graphql-client'
import { gql } from 'graphql-request'
import type {
	Agency,
	CreateAgencyInput,
	UpdateAgencyInput,
	SupabaseGraphQLResponse,
	SupabaseMutationResponse,
} from '@/lib/types/graphql'

// GraphQL Queries for Agencies
const GET_AGENCIES_QUERY = gql`
	query GetAgencies($first: Int, $offset: Int, $orderBy: [agenciesOrderBy!]) {
		agenciesCollection(first: $first, offset: $offset, orderBy: $orderBy) {
			edges {
				node {
					id
					name
					email
					phone
					address
					created_at
					updated_at
					propertiesCollection {
						edges {
							node {
								id
								title
								price
								city
								property_type
								status
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

const GET_AGENCY_QUERY = gql`
	query GetAgency($id: UUID!) {
		agenciesCollection(filter: { id: { eq: $id } }) {
			edges {
				node {
					id
					name
					email
					phone
					address
					created_at
					updated_at
					propertiesCollection {
						edges {
							node {
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
								created_at
								updated_at
							}
						}
					}
				}
			}
		}
	}
`

// GraphQL Mutations for Agencies
const CREATE_AGENCY_MUTATION = gql`
	mutation CreateAgency($input: agenciesInsertInput!) {
		insertIntoagenciesCollection(objects: [$input]) {
			affectedCount
			records {
				id
				name
				email
				phone
				address
				created_at
				updated_at
			}
		}
	}
`

const UPDATE_AGENCY_MUTATION = gql`
	mutation UpdateAgency($id: UUID!, $input: agenciesUpdateInput!) {
		updateagenciesCollection(filter: { id: { eq: $id } }, set: $input) {
			affectedCount
			records {
				id
				name
				email
				phone
				address
				created_at
				updated_at
			}
		}
	}
`

const DELETE_AGENCY_MUTATION = gql`
	mutation DeleteAgency($id: UUID!) {
		deleteFromagenciesCollection(filter: { id: { eq: $id } }) {
			affectedCount
		}
	}
`

// Custom hook for agencies
export function useAgencies() {
    const queryClient = useQueryClient()

    // Fetch agencies
    const getAgenciesQuery = useQuery({
        queryKey: ['agencies'],
        queryFn: async () => {
            const client = await getSupabaseGraphQLClient()
            const data = await client.request(GET_AGENCIES_QUERY, {
                first: 100,
                offset: 0,
                orderBy: [{ created_at: 'DescNullsLast' }],
            }) as SupabaseGraphQLResponse<Agency>
            return data.agenciesCollection.edges.map((edge) => edge.node)
        },
        staleTime: 10 * 60 * 1000, // 10 minutes
    })

    // Create agency
    const createAgencyMutation = useMutation({
        mutationFn: async (input: CreateAgencyInput) => {
            const client = await getSupabaseGraphQLClient()
            const data = await client.request(CREATE_AGENCY_MUTATION, { input }) as SupabaseMutationResponse<Agency>
            return data.insertIntoagenciesCollection.records[0]
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['agencies'] })
        },
    })

    // Update agency
    const updateAgencyMutation = useMutation({
        mutationFn: async ({ id, input }: { id: string; input: UpdateAgencyInput }) => {
            const client = await getSupabaseGraphQLClient()
            const data = await client.request(UPDATE_AGENCY_MUTATION, { id, input }) as SupabaseMutationResponse<Agency>
            return data.updateagenciesCollection.records[0]
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['agencies'] })
        },
    })

    // Delete agency
    const deleteAgencyMutation = useMutation({
        mutationFn: async (id: string) => {
            const client = await getSupabaseGraphQLClient()
            await client.request(DELETE_AGENCY_MUTATION, { id })
            return id
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['agencies'] })
        },
    })

    return {
        agencies: getAgenciesQuery.data || [],
        isLoading: getAgenciesQuery.isLoading,
        isError: getAgenciesQuery.isError,
        error: getAgenciesQuery.error,
        refetch: getAgenciesQuery.refetch,
        createAgency: createAgencyMutation.mutate,
        updateAgency: updateAgencyMutation.mutate,
        deleteAgency: deleteAgencyMutation.mutate,
        isCreating: createAgencyMutation.isPending,
        isUpdating: updateAgencyMutation.isPending,
        isDeleting: deleteAgencyMutation.isPending,
    }
}

// Custom hook for single agency
export function useAgency(id: string) {
    const getAgencyQuery = useQuery({
        queryKey: ['agency', id],
        queryFn: async () => {
            if (!id) return null
            const client = await getSupabaseGraphQLClient()
            const data = await client.request(GET_AGENCY_QUERY, { id }) as SupabaseGraphQLResponse<Agency>
            return data.agenciesCollection.edges[0]?.node || null
        },
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })

    return {
        agency: getAgencyQuery.data,
        isLoading: getAgencyQuery.isLoading,
        isError: getAgencyQuery.isError,
        error: getAgencyQuery.error,
        refetch: getAgencyQuery.refetch,
    }
}
