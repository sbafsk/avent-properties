// GraphQL response types for Supabase auto-generated API

export interface SupabaseGraphQLResponse<T> {
    [key: string]: {
        edges: Array<{
            node: T
        }>
        pageInfo?: {
            hasNextPage: boolean
            hasPreviousPage: boolean
            startCursor: string
            endCursor: string
        }
    }
}

export interface SupabaseMutationResponse<T> {
    [key: string]: {
        affectedCount: number
        records: T[]
    }
}

// Property types
export interface Property {
    id: string
    title: string
    description: string
    price: number
    currency: string
    city: string
    neighborhood?: string
    property_type: string
    bedrooms?: number
    bathrooms?: number
    area_m2?: number
    amenities: string[]
    images: string[]
    status: string
    agency_id: string
    created_at: string
    updated_at: string
    agency?: Agency
    tour_reservationsCollection?: {
        edges: Array<{
            node: TourReservation
        }>
    }
}

export interface CreatePropertyInput {
    title: string
    description: string
    price: number
    currency: string
    city: string
    neighborhood?: string
    property_type: string
    bedrooms?: number
    bathrooms?: number
    area_m2?: number
    amenities?: string[]
    images?: string[]
    status: string
    agency_id: string
}

export interface UpdatePropertyInput {
    title?: string
    description?: string
    price?: number
    currency?: string
    city?: string
    neighborhood?: string
    property_type?: string
    bedrooms?: number
    bathrooms?: number
    area_m2?: number
    amenities?: string[]
    images?: string[]
    status?: string
    agency_id?: string
}

// Agency types
export interface Agency {
    id: string
    name: string
    email: string
    phone?: string
    address?: string
    created_at: string
    updated_at: string
    propertiesCollection?: {
        edges: Array<{
            node: Property
        }>
    }
}

export interface CreateAgencyInput {
    name: string
    email: string
    phone?: string
    address?: string
}

export interface UpdateAgencyInput {
    name?: string
    email?: string
    phone?: string
    address?: string
}

// Reservation types
export interface TourReservation {
    id: string
    user_id: string
    property_id: string
    scheduled_date: string
    deposit_amount: number
    status: string
    created_at: string
    updated_at: string
    user?: User
    property?: Property
}

export interface CreateReservationInput {
    user_id: string
    property_id: string
    scheduled_date: string
    deposit_amount: number
}

export interface UpdateReservationInput {
    scheduled_date?: string
    deposit_amount?: number
    status?: string
}

// User types
export interface User {
    id: string
    email: string
    name: string
    role: string
    created_at: string
    updated_at: string
    tour_reservationsCollection?: {
        edges: Array<{
            node: TourReservation
        }>
    }
    transactionsCollection?: {
        edges: Array<{
            node: Transaction
        }>
    }
}

export interface CreateUserInput {
    email: string
    name: string
    role: string
}

export interface UpdateUserInput {
    email?: string
    name?: string
    role?: string
}

// Transaction types
export interface Transaction {
    id: string
    amount: number
    type: string
    status: string
    reservation_id?: string
    user_id: string
    created_at: string
    updated_at: string
    user?: User
    reservation?: TourReservation
}

export interface CreateTransactionInput {
    amount: number
    type: string
    reservation_id?: string
    user_id: string
}

export interface UpdateTransactionInput {
    amount?: number
    type?: string
    status?: string
}

// Contact Request types
export interface ContactRequest {
    id: string
    name: string
    email: string
    phone?: string
    message: string
    property_id?: string
    status: string
    user_id?: string
    created_at: string
    updated_at: string
    user?: User
    property?: Property
}

export interface CreateContactRequestInput {
    name: string
    email: string
    phone?: string
    message: string
    property_id?: string
}

export interface UpdateContactRequestInput {
    status?: string
}

// Filter types
export interface PropertyFilters {
    city?: string
    property_type?: string
    min_price?: number
    max_price?: number
    bedrooms?: number
    status?: string
    limit?: number
    offset?: number
}
