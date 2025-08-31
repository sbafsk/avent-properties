import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSupabaseGraphQLClient } from '@/lib/supabase/graphql-client'
import { gql } from 'graphql-request'
import type {
    Property,
    CreatePropertyInput,
    UpdatePropertyInput,
    PropertyFilters,
    SupabaseGraphQLResponse,
    SupabaseMutationResponse,
} from '@/lib/types/graphql'

// GraphQL Queries for Properties
const GET_PROPERTIES_QUERY = gql`
	query GetProperties(
		$filter: propertiesFilter
		$first: Int
		$offset: Int
		$orderBy: [propertiesOrderBy!]
	) {
		propertiesCollection(
			filter: $filter
			first: $first
			offset: $offset
			orderBy: $orderBy
		) {
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
					agency_id
					created_at
					updated_at
					agency {
						id
						name
						email
						phone
						address
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

const GET_PROPERTY_QUERY = gql`
	query GetProperty($id: UUID!) {
		propertiesCollection(filter: { id: { eq: $id } }) {
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
					agency_id
					created_at
					updated_at
					agency {
						id
						name
						email
						phone
						address
					}
					tour_reservationsCollection {
						edges {
							node {
								id
								scheduled_date
								deposit_amount
								status
								user_id
							}
						}
					}
				}
			}
		}
	}
`

// GraphQL Mutations for Properties
const CREATE_PROPERTY_MUTATION = gql`
	mutation CreateProperty($input: propertiesInsertInput!) {
		insertIntopropertiesCollection(objects: [$input]) {
			affectedCount
			records {
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
				agency_id
				created_at
				updated_at
			}
		}
	}
`

const UPDATE_PROPERTY_MUTATION = gql`
	mutation UpdateProperty($id: UUID!, $input: propertiesUpdateInput!) {
		updatepropertiesCollection(filter: { id: { eq: $id } }, set: $input) {
			affectedCount
			records {
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
				agency_id
				created_at
				updated_at
			}
		}
	}
`

const DELETE_PROPERTY_MUTATION = gql`
	mutation DeleteProperty($id: UUID!) {
		deleteFrompropertiesCollection(filter: { id: { eq: $id } }) {
			affectedCount
		}
	}
`

// Custom hook for properties
export function useProperties(filters?: PropertyFilters) {
    const queryClient = useQueryClient()

    // Build filter object for Supabase GraphQL
    const buildFilter = () => {
        if (!filters) return undefined

        const filter: Record<string, unknown> = {}

        if (filters.city) filter.city = { eq: filters.city }
        if (filters.property_type) filter.property_type = { eq: filters.property_type }
        if (filters.bedrooms) filter.bedrooms = { eq: filters.bedrooms }
        if (filters.status) filter.status = { eq: filters.status }

        if (filters.min_price || filters.max_price) {
            filter.price = {} as Record<string, number>
            if (filters.min_price) (filter.price as Record<string, number>).gte = filters.min_price
            if (filters.max_price) (filter.price as Record<string, number>).lte = filters.max_price
        }

        return Object.keys(filter).length > 0 ? filter : undefined
    }

    // Fetch properties
    const getPropertiesQuery = useQuery({
        queryKey: ['properties', filters],
        queryFn: async () => {
            const client = await getSupabaseGraphQLClient()
            const data = await client.request(GET_PROPERTIES_QUERY, {
                filter: buildFilter(),
                first: filters?.limit || 50,
                offset: filters?.offset || 0,
                orderBy: [{ created_at: 'DescNullsLast' }],
            }) as SupabaseGraphQLResponse<Property>
            return data.propertiesCollection.edges.map((edge) => edge.node)
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    })

    // Create property
    const createPropertyMutation = useMutation({
        mutationFn: async (input: CreatePropertyInput) => {
            const client = await getSupabaseGraphQLClient()
            const data = await client.request(CREATE_PROPERTY_MUTATION, { input }) as SupabaseMutationResponse<Property>
            return data.insertIntopropertiesCollection.records[0]
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['properties'] })
        },
    })

    // Update property
    const updatePropertyMutation = useMutation({
        mutationFn: async ({ id, input }: { id: string; input: UpdatePropertyInput }) => {
            const client = await getSupabaseGraphQLClient()
            const data = await client.request(UPDATE_PROPERTY_MUTATION, { id, input }) as SupabaseMutationResponse<Property>
            return data.updatepropertiesCollection.records[0]
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['properties'] })
        },
    })

    // Delete property
    const deletePropertyMutation = useMutation({
        mutationFn: async (id: string) => {
            const client = await getSupabaseGraphQLClient()
            await client.request(DELETE_PROPERTY_MUTATION, { id })
            return id
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['properties'] })
        },
    })

    return {
        properties: getPropertiesQuery.data || [],
        isLoading: getPropertiesQuery.isLoading,
        isError: getPropertiesQuery.isError,
        error: getPropertiesQuery.error,
        refetch: getPropertiesQuery.refetch,
        createProperty: createPropertyMutation.mutate,
        updateProperty: updatePropertyMutation.mutate,
        deleteProperty: deletePropertyMutation.mutate,
        isCreating: createPropertyMutation.isPending,
        isUpdating: updatePropertyMutation.isPending,
        isDeleting: deletePropertyMutation.isPending,
    }
}

// Custom hook for single property
export function useProperty(id: string) {
    const getPropertyQuery = useQuery({
        queryKey: ['property', id],
        queryFn: async () => {
            if (!id) return null
            const client = await getSupabaseGraphQLClient()
            const data = await client.request(GET_PROPERTY_QUERY, { id }) as SupabaseGraphQLResponse<Property>
            return data.propertiesCollection.edges[0]?.node || null
        },
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })

    return {
        property: getPropertyQuery.data,
        isLoading: getPropertyQuery.isLoading,
        isError: getPropertyQuery.isError,
        error: getPropertyQuery.error,
        refetch: getPropertyQuery.refetch,
    }
}
