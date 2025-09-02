# Complete Guide: Apollo Server + Supabase SDK Integration

## Overview

This guide provides a comprehensive approach to implementing GraphQL with Apollo Server and Supabase SDK, replacing complex hybrid GraphQL-to-GraphQL architectures with a simpler, more maintainable solution.

## Core Architecture Principles

### 1. Single GraphQL Endpoint
- One Apollo Server instance handling all GraphQL operations
- Supabase SDK for direct database operations
- Custom resolvers for business logic

### 2. Type Safety First
- Use Supabase generated TypeScript types
- Strongly typed GraphQL schema
- Consistent error handling patterns

### 3. Performance Optimization
- Direct database queries (no GraphQL-to-GraphQL overhead)
- Efficient query patterns with joins
- Proper pagination and filtering

## Project Setup

### Dependencies
```json
{
  "dependencies": {
    "@apollo/server": "^4.9.5",
    "graphql": "^16.8.1",
    "@supabase/supabase-js": "^2.38.4",
    "graphql-scalars": "^1.22.4"
  },
  "devDependencies": {
    "supabase": "^1.123.4",
    "@types/node": "^20.8.0",
    "typescript": "^5.2.2"
  }
}
```

### Supabase Types Generation
```bash
# Generate TypeScript types from your Supabase schema
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/database.types.ts
```

## Schema Definition

### GraphQL Schema (`schema/typeDefs.ts`)
```typescript
import { gql } from 'apollo-server-express'

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
```

## Context Setup

### Apollo Context (`lib/context.ts`)
```typescript
import { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

export interface Context {
  supabase: SupabaseClient<Database>
  user?: {
    id: string
    role: string
    email: string
  }
}

export async function createContext({ req }: { req: any }): Promise<Context> {
  const authHeader = req.headers.authorization
  const token = authHeader?.replace('Bearer ', '')

  // Create Supabase client
  const supabase = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      global: {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      }
    }
  )

  // Get user from token if provided
  let user = undefined
  if (token) {
    const { data: { user: authUser }, error } = await supabase.auth.getUser(token)
    if (!error && authUser) {
      user = {
        id: authUser.id,
        role: authUser.user_metadata?.role || 'user',
        email: authUser.email!
      }
    }
  }

  return { supabase, user }
}
```

## Resolvers Implementation

### Query Resolvers (`resolvers/queries.ts`)
```typescript
import { GraphQLError } from 'graphql'
import { Context } from '../lib/context'
import { Database } from '../lib/database.types'

type Property = Database['public']['Tables']['properties']['Row']
type Agency = Database['public']['Tables']['agencies']['Row']
type User = Database['public']['Tables']['users']['Row']
type TourReservation = Database['public']['Tables']['tour_reservations']['Row']

export const queryResolvers = {
  Query: {
    // Properties
    properties: async (
      _: any,
      { filters = {}, pagination = {} }: {
        filters?: {
          city?: string
          property_type?: string
          min_price?: number
          max_price?: number
          bedrooms?: number
          status?: string
        }
        pagination?: { limit?: number; offset?: number }
      },
      { supabase }: Context
    ) => {
      let query = supabase
        .from('properties')
        .select(`
          *,
          agency:agencies(*)
        `)

      // Apply filters
      if (filters.city) query = query.eq('city', filters.city)
      if (filters.property_type) query = query.eq('property_type', filters.property_type)
      if (filters.min_price) query = query.gte('price', filters.min_price)
      if (filters.max_price) query = query.lte('price', filters.max_price)
      if (filters.bedrooms) query = query.eq('bedrooms', filters.bedrooms)
      if (filters.status) query = query.eq('status', filters.status)

      // Apply pagination
      const limit = Math.min(pagination.limit || 50, 100) // Cap at 100
      const offset = pagination.offset || 0
      query = query.range(offset, offset + limit - 1)

      const { data, error } = await query

      if (error) {
        throw new GraphQLError(`Failed to fetch properties: ${error.message}`)
      }

      return data || []
    },

    property: async (
      _: any,
      { id }: { id: string },
      { supabase }: Context
    ) => {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          agency:agencies(*),
          reservations:tour_reservations(
            *,
            user:users(id, name, email)
          )
        `)
        .eq('id', id)
        .single()

      if (error && error.code !== 'PGRST116') { // Not found is ok
        throw new GraphQLError(`Failed to fetch property: ${error.message}`)
      }

      return data
    },

    // Agencies
    agencies: async (_: any, __: any, { supabase }: Context) => {
      const { data, error } = await supabase
        .from('agencies')
        .select(`
          *,
          properties(id, title, price, city, status)
        `)

      if (error) {
        throw new GraphQLError(`Failed to fetch agencies: ${error.message}`)
      }

      return data || []
    },

    agency: async (
      _: any,
      { id }: { id: string },
      { supabase }: Context
    ) => {
      const { data, error } = await supabase
        .from('agencies')
        .select(`
          *,
          properties(*)
        `)
        .eq('id', id)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw new GraphQLError(`Failed to fetch agency: ${error.message}`)
      }

      return data
    },

    // Users
    users: async (_: any, __: any, { supabase, user }: Context) => {
      // Only admins can list all users
      if (!user || user.role !== 'admin') {
        throw new GraphQLError('Unauthorized')
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')

      if (error) {
        throw new GraphQLError(`Failed to fetch users: ${error.message}`)
      }

      return data || []
    },

    user: async (
      _: any,
      { id }: { id: string },
      { supabase, user }: Context
    ) => {
      // Users can only access their own data or admins can access any
      if (!user || (user.id !== id && user.role !== 'admin')) {
        throw new GraphQLError('Unauthorized')
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw new GraphQLError(`Failed to fetch user: ${error.message}`)
      }

      return data
    },

    me: async (_: any, __: any, { supabase, user }: Context) => {
      if (!user) {
        throw new GraphQLError('Not authenticated')
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        throw new GraphQLError(`Failed to fetch user profile: ${error.message}`)
      }

      return data
    },

    // Reservations
    reservations: async (_: any, __: any, { supabase, user }: Context) => {
      // Only admins and agents can see all reservations
      if (!user || !['admin', 'agent'].includes(user.role)) {
        throw new GraphQLError('Unauthorized')
      }

      const { data, error } = await supabase
        .from('tour_reservations')
        .select(`
          *,
          user:users(id, name, email),
          property:properties(id, title, city, price)
        `)

      if (error) {
        throw new GraphQLError(`Failed to fetch reservations: ${error.message}`)
      }

      return data || []
    },

    reservation: async (
      _: any,
      { id }: { id: string },
      { supabase, user }: Context
    ) => {
      if (!user) {
        throw new GraphQLError('Not authenticated')
      }

      let query = supabase
        .from('tour_reservations')
        .select(`
          *,
          user:users(id, name, email),
          property:properties(id, title, city, price)
        `)
        .eq('id', id)

      // Non-admins can only see their own reservations
      if (user.role !== 'admin') {
        query = query.eq('user_id', user.id)
      }

      const { data, error } = await query.single()

      if (error && error.code !== 'PGRST116') {
        throw new GraphQLError(`Failed to fetch reservation: ${error.message}`)
      }

      return data
    },

    myReservations: async (_: any, __: any, { supabase, user }: Context) => {
      if (!user) {
        throw new GraphQLError('Not authenticated')
      }

      const { data, error } = await supabase
        .from('tour_reservations')
        .select(`
          *,
          property:properties(id, title, city, price, images)
        `)
        .eq('user_id', user.id)
        .order('scheduled_date', { ascending: true })

      if (error) {
        throw new GraphQLError(`Failed to fetch your reservations: ${error.message}`)
      }

      return data || []
    }
  }
}
```

### Mutation Resolvers (`resolvers/mutations.ts`)
```typescript
import { GraphQLError } from 'graphql'
import { Context } from '../lib/context'

export const mutationResolvers = {
  Mutation: {
    createReservation: async (
      _: any,
      { input }: {
        input: {
          property_id: string
          scheduled_date: string
          deposit_amount: number
        }
      },
      { supabase, user }: Context
    ) => {
      if (!user) {
        throw new GraphQLError('Authentication required')
      }

      // Business logic validation
      const scheduledDate = new Date(input.scheduled_date)
      const now = new Date()
      
      if (scheduledDate <= now) {
        throw new GraphQLError('Scheduled date must be in the future')
      }

      // Check if property exists and is available
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .select('id, status, title')
        .eq('id', input.property_id)
        .single()

      if (propertyError) {
        throw new GraphQLError('Property not found')
      }

      if (property.status !== 'available') {
        throw new GraphQLError('Property is not available for reservation')
      }

      // Check for existing reservations on the same date
      const { data: existingReservation } = await supabase
        .from('tour_reservations')
        .select('id')
        .eq('property_id', input.property_id)
        .eq('scheduled_date', input.scheduled_date)
        .eq('status', 'confirmed')
        .single()

      if (existingReservation) {
        throw new GraphQLError('This time slot is already reserved')
      }

      // Create reservation
      const { data, error } = await supabase
        .from('tour_reservations')
        .insert({
          user_id: user.id,
          property_id: input.property_id,
          scheduled_date: input.scheduled_date,
          deposit_amount: input.deposit_amount,
          status: 'pending'
        })
        .select(`
          *,
          user:users(id, name, email),
          property:properties(id, title, city, price)
        `)
        .single()

      if (error) {
        throw new GraphQLError(`Failed to create reservation: ${error.message}`)
      }

      return data
    },

    updateReservation: async (
      _: any,
      { input }: {
        input: {
          id: string
          scheduled_date?: string
          deposit_amount?: number
          status?: string
        }
      },
      { supabase, user }: Context
    ) => {
      if (!user) {
        throw new GraphQLError('Authentication required')
      }

      // Check ownership or admin rights
      const { data: existingReservation, error: fetchError } = await supabase
        .from('tour_reservations')
        .select('user_id, status')
        .eq('id', input.id)
        .single()

      if (fetchError) {
        throw new GraphQLError('Reservation not found')
      }

      if (user.role !== 'admin' && existingReservation.user_id !== user.id) {
        throw new GraphQLError('Unauthorized to update this reservation')
      }

      // Prepare update data
      const updateData: any = {}
      if (input.scheduled_date) {
        const scheduledDate = new Date(input.scheduled_date)
        if (scheduledDate <= new Date()) {
          throw new GraphQLError('Scheduled date must be in the future')
        }
        updateData.scheduled_date = input.scheduled_date
      }
      if (input.deposit_amount) updateData.deposit_amount = input.deposit_amount
      if (input.status) updateData.status = input.status

      const { data, error } = await supabase
        .from('tour_reservations')
        .update(updateData)
        .eq('id', input.id)
        .select(`
          *,
          user:users(id, name, email),
          property:properties(id, title, city, price)
        `)
        .single()

      if (error) {
        throw new GraphQLError(`Failed to update reservation: ${error.message}`)
      }

      return data
    },

    cancelReservation: async (
      _: any,
      { id }: { id: string },
      { supabase, user }: Context
    ) => {
      if (!user) {
        throw new GraphQLError('Authentication required')
      }

      // Check ownership or admin rights
      const { data: existingReservation, error: fetchError } = await supabase
        .from('tour_reservations')
        .select('user_id, status, scheduled_date')
        .eq('id', id)
        .single()

      if (fetchError) {
        throw new GraphQLError('Reservation not found')
      }

      if (user.role !== 'admin' && existingReservation.user_id !== user.id) {
        throw new GraphQLError('Unauthorized to cancel this reservation')
      }

      if (existingReservation.status === 'cancelled') {
        throw new GraphQLError('Reservation is already cancelled')
      }

      // Check if cancellation is allowed (e.g., not too close to scheduled date)
      const scheduledDate = new Date(existingReservation.scheduled_date)
      const now = new Date()
      const hoursUntilReservation = (scheduledDate.getTime() - now.getTime()) / (1000 * 60 * 60)
      
      if (hoursUntilReservation < 24 && user.role !== 'admin') {
        throw new GraphQLError('Cannot cancel reservation less than 24 hours before scheduled time')
      }

      const { data, error } = await supabase
        .from('tour_reservations')
        .update({ status: 'cancelled' })
        .eq('id', id)
        .select(`
          *,
          user:users(id, name, email),
          property:properties(id, title, city, price)
        `)
        .single()

      if (error) {
        throw new GraphQLError(`Failed to cancel reservation: ${error.message}`)
      }

      return data
    }
  }
}
```

## Server Setup

### Apollo Server Configuration (`server.ts`)
```typescript
import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { typeDefs } from './schema/typeDefs'
import { queryResolvers } from './resolvers/queries'
import { mutationResolvers } from './resolvers/mutations'
import { createContext } from './lib/context'

const resolvers = {
  ...queryResolvers,
  ...mutationResolvers
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    console.error('GraphQL Error:', error)
    
    // Don't expose internal errors in production
    if (process.env.NODE_ENV === 'production') {
      if (error.message.startsWith('Failed to')) {
        return new Error('Internal server error')
      }
    }
    
    return error
  }
})

async function startServer() {
  const { url } = await startStandaloneServer(server, {
    context: createContext,
    listen: { port: parseInt(process.env.PORT || '4000') }
  })

  console.log(`🚀 Server ready at ${url}`)
}

startServer()
```

## Best Practices

### 1. Error Handling
```typescript
// Always handle Supabase errors consistently
const { data, error } = await supabase.from('table').select('*')

if (error) {
  console.error('Database error:', error)
  throw new GraphQLError(`Operation failed: ${error.message}`)
}

return data || []
```

### 2. Authentication Guards
```typescript
// Create reusable auth guards
export const requireAuth = (user?: Context['user']) => {
  if (!user) {
    throw new GraphQLError('Authentication required')
  }
  return user
}

export const requireRole = (user: Context['user'], allowedRoles: string[]) => {
  if (!user || !allowedRoles.includes(user.role)) {
    throw new GraphQLError('Insufficient permissions')
  }
}
```

### 3. Query Optimization
```typescript
// Use specific selects to avoid over-fetching
const { data } = await supabase
  .from('properties')
  .select(`
    id, title, price,
    agency:agencies(name, phone)
  `)
  
// Use indexes for common filters
// Add this to your Supabase SQL editor:
// CREATE INDEX idx_properties_city ON properties(city);
// CREATE INDEX idx_properties_status ON properties(status);
```

### 4. Input Validation
```typescript
// Validate inputs before database operations
const validateReservationInput = (input: CreateReservationInput) => {
  if (!input.property_id || !input.scheduled_date || !input.deposit_amount) {
    throw new GraphQLError('Missing required fields')
  }
  
  if (input.deposit_amount < 0) {
    throw new GraphQLError('Deposit amount must be positive')
  }
  
  const date = new Date(input.scheduled_date)
  if (isNaN(date.getTime())) {
    throw new GraphQLError('Invalid date format')
  }
}
```

## Testing Strategy

### Unit Tests Example
```typescript
// resolvers/queries.test.ts
import { queryResolvers } from './queries'
import { createMockContext } from '../test/helpers'

describe('Property Resolvers', () => {
  it('should fetch properties with filters', async () => {
    const mockContext = createMockContext()
    const result = await queryResolvers.Query.properties(
      {},
      { filters: { city: 'Miami' } },
      mockContext
    )
    
    expect(result).toBeDefined()
    expect(mockContext.supabase.from).toHaveBeenCalledWith('properties')
  })
})
```

## Migration from Hybrid Resolver

### Step 1: Update Dependencies
```bash
npm uninstall [hybrid-resolver-packages]
npm install @supabase/supabase-js
```

### Step 2: Replace Resolvers
```typescript
// Before (hybrid approach)
const result = await hybridResolver.routeQuery('properties', args, context, customResolver)

// After (direct approach)
const { data, error } = await supabase
  .from('properties')
  .select('*')
  .eq('city', args.city)
```

### Step 3: Update Context
Replace GraphQL client initialization with Supabase client in context.

### Step 4: Test Thoroughly
- Run integration tests
- Verify all queries return expected data
- Check performance improvements

## Performance Monitoring

### Key Metrics to Track
- Query response times
- Database connection usage
- Memory consumption
- Error rates

### Optimization Tips
- Use connection pooling
- Implement query result caching
- Add database indexes for frequent filters
- Use pagination for large result sets

This architecture provides a robust, maintainable, and performant foundation for your GraphQL API while leveraging Supabase's powerful features directly.

I've created a comprehensive training document for your AI agent on implementing the optimal Apollo Server + Supabase SDK architecture. This guide covers:
Key Benefits of this approach:

Simplified Architecture: Single GraphQL endpoint, no dual schema management
Better Performance: Direct database queries instead of GraphQL-to-GraphQL overhead
Enhanced Type Safety: Leverage Supabase's generated TypeScript types
Easier Maintenance: Standard Apollo patterns, cleaner error handling
Cost Effective: Fewer network calls, better resource utilization

The guide includes:

Complete project setup with proper dependencies
Type-safe GraphQL schema definitions
Comprehensive resolver implementations with business logic
Authentication and authorization patterns
Error handling best practices
Performance optimization strategies
Testing approaches
Step-by-step migration plan from your current hybrid approach

This replaces the complexity of managing two GraphQL systems with a single, well-structured Apollo Server that uses Supabase SDK directly for all database operations. The result is more maintainable code, better performance, and easier debugging.