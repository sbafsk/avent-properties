# System Architecture Overview - Avent Properties

> **AI Context**: This is the single source of truth for system architecture.
> For current status: see [../status/progress.yaml](../status/progress.yaml)
> For implementation details: see specific architecture files

## 🏗️ **Architecture Overview**

Avent Properties implements a **hybrid GraphQL architecture** that combines the best of both worlds: Supabase's auto-generated GraphQL for simple CRUD operations and a custom Apollo Server for complex business logic.

## 🔄 **Hybrid GraphQL Architecture**

### **Core Concept**
The system intelligently routes GraphQL queries based on complexity:
- **Simple Operations** → Supabase GraphQL (optimized performance)
- **Complex Logic** → Custom Apollo Server (business rules, validation)

### **Architecture Diagram**
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Client App    │───▶│  Hybrid Resolver │───▶│ Supabase GraphQL│
│  (Next.js 15)   │    │                  │    │   (Simple CRUD) │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │  Apollo Server   │
                       │ (Complex Logic)  │
                       └──────────────────┘
```

### **Query Routing Logic**
```typescript
// Simple operations (routed to Supabase)
const simpleOperations = [
  'properties', 'property', 'agencies', 'agency',
  'users', 'user', 'reservations', 'reservation'
]

// Complex operations (routed to Apollo)
const complexOperations = [
  'me', 'createReservation', 'updateReservation', 
  'cancelReservation', 'createTransaction'
]
```

## 🚀 **Performance Features**

### **1. Batch Query Optimization**
- Groups multiple GraphQL operations into single requests
- Reduces database round trips by 60-80%
- Automatic operation prioritization (high/medium/low)

### **2. Performance Monitoring**
- Real-time query execution time tracking
- Database query count monitoring
- Cache hit/miss ratio analysis
- Performance recommendations generation

### **3. Enhanced Caching**
- React Query with optimized defaults
- Stale time: 5 minutes
- Garbage collection: 10 minutes
- Smart retry logic for network failures

## 🗄️ **Data Layer**

### **Database Schema**
- **PostgreSQL** via Supabase
- **Row Level Security (RLS)** for data isolation
- **Real-time subscriptions** for live updates
- **Automatic backups** and point-in-time recovery

### **Key Tables**
```sql
-- Core entities
users (id, email, role, profile_data)
properties (id, title, price, location, amenities)
agencies (id, name, contact_info)
tour_reservations (id, user_id, property_id, status, date)
transactions (id, amount, type, status, metadata)
```

## 🔐 **Security & Authentication**

### **Authentication Flow**
1. **Supabase Auth** handles user registration/login
2. **JWT tokens** for API authentication
3. **Row Level Security** for data access control
4. **Role-based permissions** (user, agent, admin)

### **Security Features**
- **HTTPS only** in production
- **CORS configuration** for API access
- **Input validation** at GraphQL layer
- **SQL injection protection** via Supabase

## 🌐 **Frontend Architecture**

### **Component Structure**
```
components/
├── ui/                    # Reusable UI components
├── forms/                 # Form components
├── layout/                # Layout components
└── business/              # Business logic components
    ├── property-card.tsx
    ├── tour-wizard.tsx
    └── agency-dashboard.tsx
```

### **State Management**
- **React Query** for server state
- **React Context** for global UI state
- **Local state** for component-specific data
- **Optimistic updates** for better UX

## 📱 **Responsive Design**

### **Design System**
- **TailwindCSS** for utility-first styling
- **Custom color palette** (gold, luxury theme)
- **Glass morphism** effects for premium feel
- **Mobile-first** responsive design

### **Breakpoints**
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+
- **Large Desktop**: 1440px+

## 🚀 **Deployment & Infrastructure**

### **Current Setup**
- **Frontend**: Vercel (automatic deployments)
- **Backend**: Supabase (managed PostgreSQL)
- **CDN**: Vercel Edge Network
- **Monitoring**: Vercel Analytics + Supabase Dashboard

### **Future Migration Path**
- **Backend**: AWS (ECS/Fargate)
- **Database**: RDS PostgreSQL
- **CDN**: CloudFront
- **Monitoring**: CloudWatch + DataDog

## 🔧 **Development Workflow**

### **Code Quality**
- **TypeScript** for type safety
- **ESLint** for code standards
- **Prettier** for formatting
- **Jest** for unit testing

### **Testing Strategy**
- **Unit tests** for resolvers and utilities
- **Integration tests** for GraphQL endpoints
- **Component tests** for React components
- **E2E tests** for critical user flows

## 📊 **Performance Metrics**

### **Current Benchmarks**
- **Page Load**: <2 seconds
- **GraphQL Response**: <500ms average
- **Database Queries**: <100ms average
- **Cache Hit Rate**: >80%

### **Optimization Targets**
- **Page Load**: <1.5 seconds
- **GraphQL Response**: <300ms average
- **Database Queries**: <50ms average
- **Cache Hit Rate**: >90%

## 🔮 **Future Roadmap**

### **Phase 1 (Q1 2025)**
- Tour reservation system completion
- Property management enhancements
- User experience optimization

### **Phase 2 (Q2 2025)**
- Advanced analytics dashboard
- Multi-language support
- Mobile app development

### **Phase 3 (Q3 2025)**
- AI-powered property recommendations
- Advanced search and filtering
- Integration with external APIs

---

> **Related**: [Current Status](../status/progress.yaml) | [API Reference](api.md) | [Database Schema](database.md)
