# Coding Standards - Avent Properties

> **AI Context**: This document defines immutable coding standards.
> For current status: see [../docs/status/progress.yaml](../docs/status/progress.yaml)
> For architecture details: see [../docs/architecture/overview.md](../docs/architecture/overview.md)

## 🎯 **Code Quality Standards**

### **TypeScript Standards**
- **Strict Mode**: Always enabled
- **Type Safety**: 100% type coverage required
- **No `any` Types**: Use proper type definitions
- **Interface First**: Define interfaces before implementation

### **React Standards**
- **Functional Components**: Use hooks and functional components
- **Props Interface**: Define prop types for all components
- **Custom Hooks**: Extract reusable logic into custom hooks
- **Error Boundaries**: Implement error boundaries for critical sections

### **GraphQL Standards**
- **Schema First**: Define schema before implementing resolvers
- **Type Safety**: Use generated types from GraphQL schema
- **Error Handling**: Proper error handling with GraphQLError
- **Performance**: Implement query complexity analysis

## 📝 **Code Style Guidelines**

### **Naming Conventions**
```typescript
// ✅ Good
const userProfile = getUserProfile()
const isAuthenticated = checkAuthStatus()
const handleSubmit = (event: FormEvent) => {}

// ❌ Bad
const up = getUP()
const auth = checkAuth()
const submit = (e: FormEvent) => {}
```

### **File Naming**
```bash
# ✅ Good
user-profile.tsx
property-card.tsx
tour-wizard.tsx
auth-form.tsx

# ❌ Bad
UserProfile.tsx
PropertyCard.tsx
TourWizard.tsx
AuthForm.tsx
```

### **Component Structure**
```typescript
// ✅ Standard component structure
import React from 'react'
import { ComponentProps } from './types'

interface ComponentProps {
  title: string
  onAction: () => void
}

export function Component({ title, onAction }: ComponentProps) {
  // Hooks first
  const [state, setState] = useState('')
  
  // Event handlers
  const handleClick = () => {
    onAction()
  }
  
  // Render
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={handleClick}>Action</button>
    </div>
  )
}
```

## 🏗️ **Architecture Patterns**

### **Component Patterns**
```typescript
// ✅ Compound component pattern
export function PropertyCard({ children, ...props }: PropertyCardProps) {
  return (
    <div className="property-card" {...props}>
      {children}
    </div>
  )
}

PropertyCard.Header = function PropertyCardHeader({ children }: { children: React.ReactNode }) {
  return <div className="property-card-header">{children}</div>
}

PropertyCard.Body = function PropertyCardBody({ children }: { children: React.ReactNode }) {
  return <div className="property-card-body">{children}</div>
}
```

### **Hook Patterns**
```typescript
// ✅ Custom hook pattern
export function useProperty(propertyId: string) {
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  useEffect(() => {
    async function fetchProperty() {
      try {
        setLoading(true)
        const data = await getProperty(propertyId)
        setProperty(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProperty()
  }, [propertyId])
  
  return { property, loading, error }
}
```

### **API Pattern**
```typescript
// ✅ API service pattern
export class PropertyService {
  static async getProperties(filters: PropertyFilters): Promise<Property[]> {
    const response = await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filters)
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  }
}
```

## 🧪 **Testing Standards**

### **Test Structure**
```typescript
// ✅ Test file structure
import { render, screen } from '@testing-library/react'
import { Component } from './Component'

describe('Component', () => {
  it('should render correctly', () => {
    render(<Component title="Test" />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
  
  it('should handle user interactions', async () => {
    const mockAction = jest.fn()
    render(<Component title="Test" onAction={mockAction} />)
    
    const button = screen.getByRole('button')
    await userEvent.click(button)
    
    expect(mockAction).toHaveBeenCalledTimes(1)
  })
})
```

### **Mocking Standards**
```typescript
// ✅ Proper mocking
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: mockData,
        error: null
      })
    })
  }
}))
```

## 🎨 **Styling Standards**

### **TailwindCSS Usage**
```typescript
// ✅ Consistent class ordering
<div className="
  flex items-center justify-between
  p-4 md:p-6
  bg-white dark:bg-gray-900
  border border-gray-200 dark:border-gray-700
  rounded-lg shadow-sm
  hover:shadow-md transition-shadow
">
```

### **Custom CSS Classes**
```css
/* ✅ Custom utility classes */
.glass {
  @apply bg-white/10 backdrop-blur-md border border-white/20;
}

.heading-luxury {
  @apply font-serif text-2xl md:text-3xl font-bold;
}

.text-luxury {
  @apply font-light text-sm md:text-base;
}
```

## 🔒 **Security Standards**

### **Input Validation**
```typescript
// ✅ Input validation
function validatePropertyData(data: unknown): Property {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid property data')
  }
  
  const property = data as Record<string, unknown>
  
  if (typeof property.title !== 'string' || property.title.length < 1) {
    throw new Error('Property title is required')
  }
  
  if (typeof property.price !== 'number' || property.price <= 0) {
    throw new Error('Property price must be positive')
  }
  
  return property as Property
}
```

### **Authentication Checks**
```typescript
// ✅ Authentication middleware
export function withAuth<T extends object>(
  Component: React.ComponentType<T>,
  requiredRole?: UserRole
) {
  return function AuthenticatedComponent(props: T) {
    const { user, loading } = useAuth()
    
    if (loading) return <LoadingSpinner />
    if (!user) return <Unauthorized />
    if (requiredRole && user.role !== requiredRole) return <Forbidden />
    
    return <Component {...props} />
  }
}
```

## 📊 **Performance Standards**

### **React Optimization**
```typescript
// ✅ Performance optimization
export const PropertyCard = React.memo(function PropertyCard({ property }: PropertyCardProps) {
  const handleClick = useCallback(() => {
    // Handle click
  }, [])
  
  return (
    <div onClick={handleClick}>
      <h3>{property.title}</h3>
      <p>{property.description}</p>
    </div>
  )
})
```

### **GraphQL Optimization**
```typescript
// ✅ Query optimization
const GET_PROPERTIES = gql`
  query GetProperties($limit: Int!, $offset: Int!) {
    properties(limit: $limit, offset: $offset) {
      id
      title
      price
      location
      images
    }
  }
`

// Use React Query for caching
const { data, loading } = useQuery(GET_PROPERTIES, {
  variables: { limit: 20, offset: 0 },
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000,   // 10 minutes
})
```

## 🚫 **Anti-Patterns to Avoid**

### **React Anti-Patterns**
```typescript
// ❌ Don't do this
function Component() {
  const [count, setCount] = useState(0)
  
  // Don't call setState in render
  if (count === 0) {
    setCount(1)
  }
  
  return <div>{count}</div>
}

// ❌ Don't create objects in render
function Component({ user }: { user: User }) {
  const userConfig = { name: user.name, role: user.role } // Created every render
  
  return <div>{userConfig.name}</div>
}
```

### **TypeScript Anti-Patterns**
```typescript
// ❌ Don't use any
function processData(data: any) {
  return data.someProperty // No type safety
}

// ❌ Don't ignore type errors
// @ts-ignore
const result = someFunction()

// ✅ Use proper types
function processData<T extends Record<string, unknown>>(data: T) {
  return data.someProperty
}
```

## 📋 **Code Review Checklist**

### **Before Submitting**
- [ ] All tests pass
- [ ] No linting errors
- [ ] TypeScript compilation successful
- [ ] Component follows established patterns
- [ ] Proper error handling implemented
- [ ] Performance considerations addressed
- [ ] Security best practices followed

### **Review Focus Areas**
- **Type Safety**: No `any` types, proper interfaces
- **Performance**: No unnecessary re-renders, proper memoization
- **Security**: Input validation, authentication checks
- **Testing**: Adequate test coverage, proper mocking
- **Documentation**: Clear comments, README updates

## 🔄 **Continuous Improvement**

### **Regular Reviews**
- **Monthly**: Review and update coding standards
- **Quarterly**: Performance benchmark review
- **Annually**: Security standards audit

### **Feedback Loop**
- **Developer Feedback**: Collect input on standards
- **Tool Updates**: Keep linting and testing tools current
- **Best Practices**: Incorporate industry best practices

---

> **Related**: [Architecture Overview](../docs/architecture/overview.md) | [Setup Guide](../docs/guides/setup.md)
