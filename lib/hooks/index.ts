// Export all custom hooks for easy importing
export { useProperties, useProperty } from './useSupabaseGraphQL'
export { useAgencies, useAgency } from './useAgencies'
export { useUsers, useUser } from './useUsers'
export { useReservations, useReservation, useUserReservations, usePropertyReservations } from './useReservations'
export { useTransactions, useTransaction, useUserTransactions } from './useTransactions'
export { useContactRequests, useContactRequest } from './useContactRequests'

// Export types
export type {
    Property,
    CreatePropertyInput,
    UpdatePropertyInput,
    PropertyFilters,
    Agency,
    CreateAgencyInput,
    UpdateAgencyInput,
    User,
    CreateUserInput,
    UpdateUserInput,
    TourReservation,
    CreateReservationInput,
    UpdateReservationInput,
    Transaction,
    CreateTransactionInput,
    UpdateTransactionInput,
    ContactRequest,
    CreateContactRequestInput,
    UpdateContactRequestInput,
    SupabaseGraphQLResponse,
    SupabaseMutationResponse,
} from '@/lib/types/graphql'
