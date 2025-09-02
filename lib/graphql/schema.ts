import { gql } from 'graphql-tag'

export const typeDefs = gql`
  scalar DateTime
  scalar JSON
  scalar UUID

  type Property {
    id: UUID!
    title: String!
    description: String
    price: Float!
    currency: String!
    city: String!
    neighborhood: String
    property_type: String!
    bedrooms: Int!
    bathrooms: Int!
    area_m2: Float!
    amenities: [String!]!
    images: [String!]!
    status: PropertyStatus!
    agency_id: UUID!
    created_at: DateTime!
    updated_at: DateTime!
    
    # Relations
    agency: Agency
    reservations: [TourReservation!]!
  }

  type Agency {
    id: UUID!
    name: String!
    email: String!
    phone: String
    address: String
    created_at: DateTime!
    updated_at: DateTime!
    
    # Relations
    properties: [Property!]!
  }

  type User {
    id: UUID!
    email: String!
    name: String
    role: UserRole!
    created_at: DateTime!
    updated_at: DateTime!
    
    # Relations
    reservations: [TourReservation!]!
  }

  type TourReservation {
    id: UUID!
    scheduled_date: DateTime!
    deposit_amount: Float!
    status: ReservationStatus!
    user_id: UUID!
    property_id: UUID!
    created_at: DateTime!
    updated_at: DateTime!
    
    # Relations
    user: User!
    property: Property!
  }

  enum PropertyStatus {
    AVAILABLE
    RESERVED
    SOLD
  }

  enum UserRole {
    USER
    AGENT
    ADMIN
  }

  enum ReservationStatus {
    PENDING
    CONFIRMED
    CANCELLED
  }

  # Input Types
  input PropertyFilters {
    city: String
    property_type: String
    min_price: Float
    max_price: Float
    bedrooms: Int
    status: PropertyStatus
  }

  input PaginationInput {
    limit: Int = 50
    offset: Int = 0
  }

  input CreatePropertyInput {
    title: String!
    description: String!
    price: Float!
    currency: String!
    city: String!
    neighborhood: String
    property_type: String!
    bedrooms: Int!
    bathrooms: Int!
    area_m2: Float!
    amenities: [String!]!
    images: [String!]!
    status: PropertyStatus!
    agency_id: UUID!
  }

  input UpdatePropertyInput {
    id: UUID!
    title: String
    description: String
    price: Float
    currency: String
    city: String
    neighborhood: String
    property_type: String
    bedrooms: Int
    bathrooms: Int
    area_m2: Float
    amenities: [String!]
    images: [String!]
    status: PropertyStatus
    agency_id: UUID
  }

  input CreateReservationInput {
    property_id: UUID!
    scheduled_date: DateTime!
    deposit_amount: Float!
  }

  input UpdateReservationInput {
    id: UUID!
    scheduled_date: DateTime
    deposit_amount: Float
    status: ReservationStatus
  }

  type Query {
    # Properties
    properties(filters: PropertyFilters, pagination: PaginationInput): [Property!]!
    property(id: UUID!): Property
    
    # Agencies
    agencies: [Agency!]!
    agency(id: UUID!): Agency
    
    # Users
    users: [User!]!
    user(id: UUID!): User
    me: User
    
    # Reservations
    reservations: [TourReservation!]!
    reservation(id: UUID!): TourReservation
    myReservations: [TourReservation!]!
  }

  type Mutation {
    # Reservations
    createReservation(input: CreateReservationInput!): TourReservation!
    updateReservation(input: UpdateReservationInput!): TourReservation!
    cancelReservation(id: UUID!): TourReservation!
    
    # Properties (Admin only)
    createProperty(input: CreatePropertyInput!): Property!
    updateProperty(input: UpdatePropertyInput!): Property!
    deleteProperty(id: UUID!): Boolean!
  }
`
