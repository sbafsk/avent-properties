# Apollo Server + Supabase SDK Integration - Core Guide

## 🎯 **Overview**

Essential implementation guide for GraphQL with Apollo Server and Supabase SDK. This replaces complex hybrid architectures with a simpler, maintainable solution.

---

## 🏗️ **Core Architecture**

### **Single GraphQL Endpoint**
- One Apollo Server instance handling all operations
- Supabase SDK for direct database operations
- Custom resolvers for business logic

### **Type Safety First**
- Supabase generated TypeScript types
- Strongly typed GraphQL schema
- Consistent error handling patterns

---

## 📦 **Project Setup**

### **Dependencies**
```json
{
  "dependencies": {
    "@apollo/server": "^4.9.5",
    "graphql": "^16.8.1",
    "@supabase/supabase-js": "^2.38.4",
    "graphql-scalars": "^1.22.4"
  }
}
```

### **Type Generation**
```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/database.types.ts
```

---

## 📋 **Core Schema Types**

### **Property Type**
```typescript
type Property {
  id: UUID!
  title: String!
  description: String
  price: Float!
  currency: String!
  city: String!
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
```

### **Agency Type**
```typescript
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
```

---

## 🔧 **Resolver Implementation**

### **Property Resolvers**
```typescript
const resolvers = {
  Query: {
    properties: async (_, { limit = 10, offset = 0, filters = {} }) => {
      try {
        let query = supabase
          .from('properties')
          .select(`
            *,
            agency:agencies(*)
          `)
        
        // Apply filters
        if (filters.city) {
          query = query.eq('city', filters.city)
        }
        if (filters.property_type) {
          query = query.eq('property_type', filters.property_type)
        }
        if (filters.min_price) {
          query = query.gte('price', filters.min_price)
        }
        if (filters.max_price) {
          query = query.lte('price', filters.max_price)
        }
        
        const { data, error } = await query
          .range(offset, offset + limit - 1)
          .order('created_at', { ascending: false })
        
        if (error) throw error
        
        return data || []
      } catch (error) {
        throw new GraphQLError('Failed to fetch properties', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' }
        })
      }
    },
    
    property: async (_, { id }) => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select(`
            *,
            agency:agencies(*),
            reservations:tour_reservations(*)
          `)
          .eq('id', id)
          .single()
        
        if (error) throw error
        return data
      } catch (error) {
        throw new GraphQLError('Property not found', {
          extensions: { code: 'NOT_FOUND' }
        })
      }
    }
  },
  
  Mutation: {
    createProperty: async (_, { input }, { user }) => {
      try {
        // Validate user permissions
        if (!user || !user.agency_id) {
          throw new GraphQLError('Unauthorized', {
            extensions: { code: 'UNAUTHORIZED' }
          })
        }
        
        const { data, error } = await supabase
          .from('properties')
          .insert({
            ...input,
            agency_id: user.agency_id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single()
        
        if (error) throw error
        return data
      } catch (error) {
        throw new GraphQLError('Failed to create property', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' }
        })
      }
    }
  }
}
```

---

## 🚀 **Server Setup**

### **Apollo Server Configuration**
```typescript
import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { typeDefs } from './schema/typeDefs'
import { resolvers } from './resolvers'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    console.error('GraphQL Error:', error)
    
    // Return sanitized error for production
    if (process.env.NODE_ENV === 'production') {
      return {
        message: 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR'
      }
    }
    
    return error
  }
})

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    // Extract user from auth header
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (token) {
      try {
        const { data: { user }, error } = await supabase.auth.getUser(token)
        if (!error && user) {
          return { user }
        }
      } catch (error) {
        console.error('Auth error:', error)
      }
    }
    
    return { user: null }
  }
})

console.log(`🚀 Server ready at: ${url}`)
```

---

## 🔐 **Authentication & Authorization**

### **Context Setup**
```typescript
context: async ({ req }) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  if (token) {
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token)
      if (!error && user) {
        // Get additional user data from profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        return { 
          user: { ...user, ...profile },
          supabase: supabase.auth.admin
        }
      }
    } catch (error) {
      console.error('Auth error:', error)
    }
  }
  
  return { user: null, supabase }
}
```

### **Permission Checks**
```typescript
const checkAgencyPermission = (user, agencyId) => {
  if (!user || user.agency_id !== agencyId) {
    throw new GraphQLError('Insufficient permissions', {
      extensions: { code: 'FORBIDDEN' }
    })
  }
}

const checkAdminPermission = (user) => {
  if (!user || user.role !== 'admin') {
    throw new GraphQLError('Admin access required', {
      extensions: { code: 'FORBIDDEN' }
    })
  }
}
```

---

## 📊 **Performance Optimization**

### **Query Optimization**
```typescript
// Use select to limit fields
const { data } = await supabase
  .from('properties')
  .select('id, title, price, city, property_type')
  .eq('status', 'active')

// Implement pagination
const { data, count } = await supabase
  .from('properties')
  .select('*', { count: 'exact' })
  .range(offset, offset + limit - 1)

// Use filters efficiently
const { data } = await supabase
  .from('properties')
  .select('*')
  .in('city', ['Punta del Este', 'José Ignacio'])
  .gte('price', 100000)
  .lte('price', 500000)
```

### **Caching Strategy**
```typescript
// Implement Redis caching for frequently accessed data
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

const getCachedProperty = async (id) => {
  const cached = await redis.get(`property:${id}`)
  if (cached) {
    return JSON.parse(cached)
  }
  
  const { data } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single()
  
  if (data) {
    await redis.setex(`property:${id}`, 300, JSON.stringify(data)) // 5 min cache
  }
  
  return data
}
```

---

## 🧪 **Testing Strategy**

### **Resolver Testing**
```typescript
import { createTestClient } from 'apollo-server-testing'
import { ApolloServer } from '@apollo/server'
import { resolvers } from '../resolvers'
import { typeDefs } from '../schema/typeDefs'

describe('Property Resolvers', () => {
  let server: ApolloServer
  
  beforeAll(async () => {
    server = new ApolloServer({
      typeDefs,
      resolvers,
      context: () => ({ user: { id: 'test-user', agency_id: 'test-agency' } })
    })
  })
  
  it('fetches properties with filters', async () => {
    const { query } = createTestClient(server)
    
    const result = await query({
      query: `
        query GetProperties($filters: PropertyFilters) {
          properties(filters: $filters) {
            id
            title
            price
            city
          }
        }
      `,
      variables: {
        filters: { city: 'Punta del Este', min_price: 100000 }
      }
    })
    
    expect(result.errors).toBeUndefined()
    expect(result.data?.properties).toBeDefined()
  })
})
```

---

## 📚 **Best Practices**

### **Error Handling**
- Use GraphQLError with appropriate error codes
- Log errors for debugging
- Return sanitized errors in production
- Implement proper validation

### **Security**
- Validate all inputs
- Check user permissions
- Use RLS policies in Supabase
- Sanitize error messages

### **Performance**
- Implement pagination
- Use select to limit fields
- Cache frequently accessed data
- Optimize database queries

---

## 🔗 **Related Documentation**

- **Architecture Overview**: See `docs/architecture/overview.md`
- **Implementation Checklist**: See `docs/guides/implementation-checklist.md`
- **Project Status**: See `docs/status/progress.yaml`

---

## 📝 **Quick Start Checklist**

- [ ] Install dependencies
- [ ] Generate Supabase types
- [ ] Set up Apollo Server
- [ ] Implement core resolvers
- [ ] Add authentication context
- [ ] Set up error handling
- [ ] Add tests
- [ ] Configure caching
- [ ] Deploy and monitor

This guide provides the essential implementation details for Apollo Server + Supabase SDK integration while maintaining compliance with documentation standards.
