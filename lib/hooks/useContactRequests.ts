import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSupabaseGraphQLClient } from '@/lib/supabase/graphql-client'
import { gql } from 'graphql-request'
import type {
    ContactRequest,
    CreateContactRequestInput,
    UpdateContactRequestInput,
    SupabaseGraphQLResponse,
    SupabaseMutationResponse,
} from '@/lib/types/graphql'

// GraphQL Queries for Contact Requests
const GET_CONTACT_REQUESTS_QUERY = gql`
	query GetContactRequests($first: Int, $offset: Int, $orderBy: [contact_requestsOrderBy!]) {
		contact_requestsCollection(first: $first, offset: $offset, orderBy: $orderBy) {
			edges {
				node {
					id
					name
					email
					phone
					message
					property_id
					status
					user_id
					created_at
					updated_at
					user {
						id
						name
						email
					}
					property {
						id
						title
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

const GET_CONTACT_REQUEST_QUERY = gql`
	query GetContactRequest($id: UUID!) {
		contact_requestsCollection(filter: { id: { eq: $id } }) {
			edges {
				node {
					id
					name
					email
					phone
					message
					property_id
					status
					user_id
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
						city
						neighborhood
						property_type
						bedrooms
						bathrooms
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

// GraphQL Mutations for Contact Requests
const CREATE_CONTACT_REQUEST_MUTATION = gql`
	mutation CreateContactRequest($input: contact_requestsInsertInput!) {
		insertIntocontact_requestsCollection(objects: [$input]) {
			affectedCount
			records {
				id
				name
				email
				phone
				message
				property_id
				status
				user_id
				created_at
				updated_at
			}
		}
	}
`

const UPDATE_CONTACT_REQUEST_MUTATION = gql`
	mutation UpdateContactRequest($id: UUID!, $input: contact_requestsUpdateInput!) {
		updatecontact_requestsCollection(filter: { id: { eq: $id } }, set: $input) {
			affectedCount
			records {
				id
				name
				email
				phone
				message
				property_id
				status
				user_id
				created_at
				updated_at
			}
		}
	}
`

const DELETE_CONTACT_REQUEST_MUTATION = gql`
	mutation DeleteContactRequest($id: UUID!) {
		deleteFromcontact_requestsCollection(filter: { id: { eq: $id } }) {
			affectedCount
		}
	}
`

// Custom hook for contact requests
export function useContactRequests() {
    const queryClient = useQueryClient()

    // Fetch contact requests
    const getContactRequestsQuery = useQuery({
        queryKey: ['contactRequests'],
        queryFn: async () => {
            const client = await getSupabaseGraphQLClient()
            const data = await client.request(GET_CONTACT_REQUESTS_QUERY, {
                first: 100,
                offset: 0,
                orderBy: [{ created_at: 'DescNullsLast' }],
            }) as SupabaseGraphQLResponse<ContactRequest>
            return data.contact_requestsCollection.edges.map((edge) => edge.node)
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    })

    // Create contact request
    const createContactRequestMutation = useMutation({
        mutationFn: async (input: CreateContactRequestInput) => {
            const client = await getSupabaseGraphQLClient()
            const data = await client.request(CREATE_CONTACT_REQUEST_MUTATION, { input }) as SupabaseMutationResponse<ContactRequest>
            return data.insertIntocontact_requestsCollection.records[0]
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contactRequests'] })
        },
    })

    // Update contact request
    const updateContactRequestMutation = useMutation({
        mutationFn: async ({ id, input }: { id: string; input: UpdateContactRequestInput }) => {
            const client = await getSupabaseGraphQLClient()
            const data = await client.request(UPDATE_CONTACT_REQUEST_MUTATION, { id, input }) as SupabaseMutationResponse<ContactRequest>
            return data.updatecontact_requestsCollection.records[0]
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contactRequests'] })
        },
    })

    // Delete contact request
    const deleteContactRequestMutation = useMutation({
        mutationFn: async (id: string) => {
            const client = await getSupabaseGraphQLClient()
            await client.request(DELETE_CONTACT_REQUEST_MUTATION, { id })
            return id
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contactRequests'] })
        },
    })

    return {
        contactRequests: getContactRequestsQuery.data || [],
        isLoading: getContactRequestsQuery.isLoading,
        isError: getContactRequestsQuery.isError,
        error: getContactRequestsQuery.error,
        refetch: getContactRequestsQuery.refetch,
        createContactRequest: createContactRequestMutation.mutate,
        updateContactRequest: updateContactRequestMutation.mutate,
        deleteContactRequest: deleteContactRequestMutation.mutate,
        isCreating: createContactRequestMutation.isPending,
        isUpdating: updateContactRequestMutation.isPending,
        isDeleting: deleteContactRequestMutation.isPending,
    }
}

// Custom hook for single contact request
export function useContactRequest(id: string) {
    const getContactRequestQuery = useQuery({
        queryKey: ['contactRequest', id],
        queryFn: async () => {
            if (!id) return null
            const client = await getSupabaseGraphQLClient()
            const data = await client.request(GET_CONTACT_REQUEST_QUERY, { id }) as SupabaseGraphQLResponse<ContactRequest>
            return data.contact_requestsCollection.edges[0]?.node || null
        },
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })

    return {
        contactRequest: getContactRequestQuery.data,
        isLoading: getContactRequestQuery.isLoading,
        isError: getContactRequestQuery.isError,
        error: getContactRequestQuery.error,
        refetch: getContactRequestQuery.refetch,
    }
}
