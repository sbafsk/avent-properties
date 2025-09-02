# System Architecture Overview

## 🏗️ **Architecture Overview**

Avent Properties implements a **direct Apollo Server + Supabase SDK architecture** that provides optimal performance, maintainability, and type safety.

## 🔄 **Direct GraphQL Architecture**

Our GraphQL implementation follows a clean, direct approach:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Client App    │───▶│  Apollo Server   │───▶│   Supabase      │
│                 │    │                  │    │   PostgreSQL    │
│ - React 19      │    │ - Schema         │    │ - Database      │
│ - Apollo Client │    │ - Resolvers      │    │ - Auth          │
│ - TypeScript    │    │ - Context        │    │ - Storage       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### **Key Benefits**
- **Direct Database Access**: No GraphQL-to-GraphQL overhead
- **Type Safety**: Full TypeScript support with generated Supabase types
- **Performance**: Optimized queries with efficient joins
- **Maintainability**: Clean, standard Apollo patterns
- **Scalability**: Easy to extend with new resolvers

## 🚀 **Performance Features**

### **1. Direct Query Optimization**
- **Eliminated Overhead**: No intermediate GraphQL layer
- **Efficient Joins**: Direct database queries with proper indexing
- **Connection Pooling**: Supabase handles database connections

### **2. Type Safety & Validation**
- **Generated Types**: Automatic TypeScript types from Supabase schema
- **Runtime Validation**: GraphQL schema validation
- **Compile-time Checks**: Full TypeScript coverage

### **3. Caching Strategy**
- **Apollo Client Cache**: Intelligent query result caching
- **Database Query Cache**: Supabase query result caching
- **Response Headers**: Proper cache control headers

## 🏛️ **System Components**

### **Frontend Layer**
```
┌─────────────────────────────────────────────────────────────┐
│                    Client Application                       │
├─────────────────────────────────────────────────────────────┤
│  Pages & Routes  │  Components  │  State Management       │
│  - App Router    │  - UI Kit    │  - Redux Toolkit        │
│  - Dynamic       │  - Forms     │  - React Query          │
│  - Static        │  - Layouts   │  - Local Storage        │
└─────────────────────────────────────────────────────────────┘
```

### **API Layer**
```
┌─────────────────────────────────────────────────────────────┐
│                    GraphQL API                             │
├─────────────────────────────────────────────────────────────┤
│  Apollo Server   │  Resolvers   │  Context & Auth         │
│  - Schema        │  - Queries   │  - JWT Validation       │
│  - Middleware    │  - Mutations │  - Role-based Access    │
│  - Error Handling│  - Validation│  - User Context         │
└─────────────────────────────────────────────────────────────┘
```

### **Data Layer**
```
┌─────────────────────────────────────────────────────────────┐
│                    Data Management                         │
├─────────────────────────────────────────────────────────────┤
│  Supabase SDK    │  Database    │  Storage & Auth          │
│  - Client        │  - PostgreSQL│  - File Storage          │
│  - Queries       │  - RLS       │  - User Management      │
│  - Subscriptions │  - Indexes   │  - Session Handling      │
└─────────────────────────────────────────────────────────────┘
```

## 🔐 **Authentication & Authorization**

### **JWT-based Authentication**
- **Token Management**: Secure JWT tokens via Supabase Auth
- **Role-based Access**: Client, Agency, Admin permissions
- **Row Level Security**: Database-level access control

### **Authorization Flow**
```
1. User Login → Supabase Auth → JWT Token
2. Token Validation → Apollo Context → User Info
3. Resolver Execution → Role Check → Data Access
4. RLS Policies → Database Query → Filtered Results
```

## 📊 **Data Flow**

### **Query Flow**
```
Client Request → Apollo Server → Resolver → Supabase SDK → PostgreSQL
     ↓              ↓            ↓           ↓           ↓
  GraphQL Query → Schema → Business Logic → Database → Results
     ↓              ↓            ↓           ↓           ↓
  Cached Result ← Apollo Cache ← Response ← Supabase ← Data
```

### **Mutation Flow**
```
Client Mutation → Apollo Server → Resolver → Validation → Supabase SDK
     ↓              ↓            ↓           ↓           ↓
  GraphQL Input → Schema → Business Rules → Input Check → Database
     ↓              ↓            ↓           ↓           ↓
  Success/Error ← Response ← Audit Log ← Transaction ← Commit
```

## 🗄️ **Database Schema**

### **Core Tables**
- **`users`** - User accounts with role-based access
- **`properties`** - Property listings with details and media
- **`agencies`** - Real estate agencies
- **`tour_reservations`** - Tour bookings with deposit tracking
- **`transactions`** - Financial transactions and commissions
- **`contact_requests`** - Customer inquiries

### **Relationships**
```
users (1) ←→ (many) tour_reservations
users (1) ←→ (many) transactions
agencies (1) ←→ (many) properties
properties (1) ←→ (many) tour_reservations
tour_reservations (1) ←→ (1) transactions
```

## 🔧 **Development Architecture**

### **File Structure**
```
lib/graphql/
├── schema.ts              # GraphQL schema definition
├── context.ts             # Apollo context with auth
└── resolvers/
    ├── index.ts           # Resolver aggregation
    ├── queries.ts         # Query resolvers
    └── mutations.ts       # Mutation resolvers

lib/
├── database.types.ts      # Generated Supabase types
├── supabase.ts            # Supabase client configuration
└── apollo-client.ts       # Apollo client configuration
```

### **Type Safety**
- **Generated Types**: `Database` interface from Supabase
- **GraphQL Types**: Schema-driven type definitions
- **Resolver Types**: Full TypeScript coverage
- **Context Types**: Typed authentication context

## 🚀 **Performance Optimization**

### **Query Optimization**
- **Efficient Joins**: Proper database relationships
- **Indexing**: Strategic database indexes
- **Pagination**: Cursor-based pagination
- **Filtering**: Database-level filtering

### **Caching Strategy**
- **Apollo Client**: Query result caching
- **Database**: Query result caching
- **CDN**: Static asset caching
- **Browser**: HTTP cache headers

## 🔒 **Security Features**

### **Data Protection**
- **Row Level Security**: Database-level access control
- **Input Validation**: GraphQL schema validation
- **SQL Injection**: Parameterized queries via Supabase
- **XSS Protection**: Content Security Policy

### **Authentication Security**
- **JWT Tokens**: Secure token management
- **Role Validation**: Server-side role checking
- **Session Management**: Secure session handling
- **Rate Limiting**: API request throttling

## 📈 **Scalability Considerations**

### **Horizontal Scaling**
- **Load Balancing**: Multiple server instances
- **Database Sharding**: Future PostgreSQL scaling
- **CDN**: Global content distribution
- **Microservices**: Future service decomposition

### **Performance Monitoring**
- **Query Performance**: GraphQL execution timing
- **Database Load**: Connection pool monitoring
- **Cache Efficiency**: Hit/miss ratio tracking
- **Response Times**: End-to-end latency

## 🧪 **Testing Strategy**

### **Test Coverage**
- **Unit Tests**: Resolver function testing
- **Integration Tests**: GraphQL endpoint testing
- **E2E Tests**: Full user flow testing
- **Performance Tests**: Load and stress testing

### **Test Tools**
- **Jest**: Unit and integration testing
- **React Testing Library**: Component testing
- **Playwright**: E2E testing
- **GraphQL Playground**: API testing

---

## 🎯 **Architecture Benefits**

| **Aspect** | **Benefit** |
|------------|-------------|
| **Performance** | Direct database access, no overhead |
| **Maintainability** | Standard Apollo patterns, clean code |
| **Type Safety** | Full TypeScript coverage |
| **Scalability** | Easy to extend and modify |
| **Security** | JWT + RLS + input validation |
| **Testing** | Comprehensive test coverage |

---

**This architecture provides a solid foundation for building and scaling the Avent Properties platform with optimal performance and maintainability.**
