# Enhanced Coding Standards - SOLID & Clean Code Principles

## Analysis of Current Standards

Your current coding standards provide a foundation but need enhancement to fully embrace SOLID principles and advanced design patterns for truly reusable components.

## SOLID Principles Implementation

### Single Responsibility Principle (SRP)

**Current Issue**: Your component example mixes UI rendering with business logic.

**Enhanced Pattern**:
```typescript
// ❌ Violates SRP - component handles both UI and business logic
export function PropertyCard({ property }: PropertyCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  
  const handleBookmark = async () => {
    try {
      await fetch(`/api/bookmarks`, {
        method: 'POST',
        body: JSON.stringify({ propertyId: property.id })
      })
      setIsBookmarked(true)
    } catch (error) {
      console.error('Failed to bookmark')
    }
  }
  
  return <div onClick={handleBookmark}>...</div>
}

// ✅ Follows SRP - separate concerns
// Business logic layer
export class BookmarkService {
  static async addBookmark(propertyId: string): Promise<void> {
    const response = await fetch(`/api/bookmarks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId })
    })
    
    if (!response.ok) {
      throw new BookmarkError('Failed to add bookmark')
    }
  }
}

// Custom hook layer
export function useBookmark(propertyId: string) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const addBookmark = useCallback(async () => {
    setIsLoading(true)
    try {
      await BookmarkService.addBookmark(propertyId)
      setIsBookmarked(true)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [propertyId])
  
  return { isBookmarked, isLoading, addBookmark }
}

// UI component layer
export function PropertyCard({ property }: PropertyCardProps) {
  const { isBookmarked, isLoading, addBookmark } = useBookmark(property.id)
  
  return (
    <Card>
      <BookmarkButton 
        isBookmarked={isBookmarked}
        isLoading={isLoading}
        onBookmark={addBookmark}
      />
    </Card>
  )
}
```

### Open/Closed Principle (OCP)

**Enhanced Pattern - Strategy Pattern for Validation**:
```typescript
// ✅ Open for extension, closed for modification
interface ValidationStrategy {
  validate(data: unknown): ValidationResult
}

class PropertyValidationStrategy implements ValidationStrategy {
  validate(data: unknown): ValidationResult {
    const schema = z.object({
      title: z.string().min(1),
      price: z.number().positive(),
      location: z.string().min(1)
    })
    
    return schema.safeParse(data)
  }
}

class ReservationValidationStrategy implements ValidationStrategy {
  validate(data: unknown): ValidationResult {
    const schema = z.object({
      propertyId: z.string().uuid(),
      userId: z.string().uuid(),
      depositAmount: z.number().positive()
    })
    
    return schema.safeParse(data)
  }
}

class FormValidator {
  constructor(private strategy: ValidationStrategy) {}
  
  validateForm(data: unknown): ValidationResult {
    return this.strategy.validate(data)
  }
  
  setStrategy(strategy: ValidationStrategy): void {
    this.strategy = strategy
  }
}

// Usage
const propertyValidator = new FormValidator(new PropertyValidationStrategy())
const reservationValidator = new FormValidator(new ReservationValidationStrategy())
```

### Liskov Substitution Principle (LSP)

**Enhanced Pattern - Proper Inheritance**:
```typescript
// ✅ Base interface that all implementations can satisfy
interface DataProvider<T> {
  fetch(id: string): Promise<T>
  create(data: Partial<T>): Promise<T>
  update(id: string, data: Partial<T>): Promise<T>
  delete(id: string): Promise<void>
}

// ✅ Implementations that are truly substitutable
class SupabasePropertyProvider implements DataProvider<Property> {
  async fetch(id: string): Promise<Property> {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw new PropertyNotFoundError(id)
    return data
  }
  
  async create(data: Partial<Property>): Promise<Property> {
    // Implementation
  }
  
  // ... other methods
}

class MockPropertyProvider implements DataProvider<Property> {
  private properties: Property[] = []
  
  async fetch(id: string): Promise<Property> {
    const property = this.properties.find(p => p.id === id)
    if (!property) throw new PropertyNotFoundError(id)
    return property
  }
  
  // ... other methods that maintain the same contract
}

// ✅ Client code works with any implementation
class PropertyService {
  constructor(private provider: DataProvider<Property>) {}
  
  async getProperty(id: string): Promise<Property> {
    return this.provider.fetch(id) // Works with any implementation
  }
}
```

### Interface Segregation Principle (ISP)

**Enhanced Pattern - Focused Interfaces**:
```typescript
// ❌ Violates ISP - fat interface
interface UserActions {
  login(email: string, password: string): Promise<void>
  logout(): Promise<void>
  updateProfile(data: UserProfile): Promise<void>
  changePassword(oldPassword: string, newPassword: string): Promise<void>
  uploadAvatar(file: File): Promise<string>
  getBookmarks(): Promise<Bookmark[]>
  addBookmark(propertyId: string): Promise<void>
}

// ✅ Follows ISP - segregated interfaces
interface AuthenticationActions {
  login(email: string, password: string): Promise<void>
  logout(): Promise<void>
}

interface ProfileActions {
  updateProfile(data: UserProfile): Promise<void>
  changePassword(oldPassword: string, newPassword: string): Promise<void>
  uploadAvatar(file: File): Promise<string>
}

interface BookmarkActions {
  getBookmarks(): Promise<Bookmark[]>
  addBookmark(propertyId: string): Promise<void>
  removeBookmark(propertyId: string): Promise<void>
}

// ✅ Components only depend on what they need
interface LoginFormProps {
  authService: AuthenticationActions // Only needs auth methods
}

interface ProfileSettingsProps {
  profileService: ProfileActions // Only needs profile methods
}
```

### Dependency Inversion Principle (DIP)

**Enhanced Pattern - Dependency Injection**:
```typescript
// ✅ Abstract dependencies
interface EmailService {
  sendReservationConfirmation(reservation: Reservation): Promise<void>
  sendPropertyAlert(user: User, property: Property): Promise<void>
}

interface PaymentService {
  processDeposit(amount: number, cardToken: string): Promise<PaymentResult>
  refundDeposit(transactionId: string): Promise<RefundResult>
}

// ✅ High-level module depends on abstractions
class ReservationService {
  constructor(
    private emailService: EmailService,
    private paymentService: PaymentService,
    private propertyProvider: DataProvider<Property>
  ) {}
  
  async createReservation(reservationData: CreateReservationInput): Promise<Reservation> {
    // Validate property exists
    const property = await this.propertyProvider.fetch(reservationData.propertyId)
    
    // Process deposit (10% of property price)
    const depositAmount = property.price * 0.1
    const paymentResult = await this.paymentService.processDeposit(
      depositAmount,
      reservationData.cardToken
    )
    
    // Create reservation record
    const reservation = await this.createReservationRecord({
      ...reservationData,
      depositAmount,
      paymentId: paymentResult.id
    })
    
    // Send confirmation email
    await this.emailService.sendReservationConfirmation(reservation)
    
    return reservation
  }
}

// ✅ Concrete implementations
class StripePaymentService implements PaymentService {
  async processDeposit(amount: number, cardToken: string): Promise<PaymentResult> {
    // Stripe implementation
  }
}

class SendGridEmailService implements EmailService {
  async sendReservationConfirmation(reservation: Reservation): Promise<void> {
    // SendGrid implementation
  }
}
```

## Advanced Component Patterns

### Compound Components with Context

```typescript
// ✅ Advanced compound component pattern
interface PropertyCardContextValue {
  property: Property
  isSelected: boolean
  onSelect: () => void
}

const PropertyCardContext = createContext<PropertyCardContextValue | null>(null)

function usePropertyCardContext() {
  const context = useContext(PropertyCardContext)
  if (!context) {
    throw new Error('PropertyCard components must be used within PropertyCard')
  }
  return context
}

export function PropertyCard({ 
  property, 
  isSelected = false,
  onSelect,
  children 
}: PropertyCardProps) {
  const contextValue = useMemo(() => ({
    property,
    isSelected,
    onSelect
  }), [property, isSelected, onSelect])
  
  return (
    <PropertyCardContext.Provider value={contextValue}>
      <div className={cn('property-card', isSelected && 'selected')}>
        {children}
      </div>
    </PropertyCardContext.Provider>
  )
}

PropertyCard.Image = function PropertyCardImage() {
  const { property } = usePropertyCardContext()
  return (
    <img 
      src={property.images[0]} 
      alt={property.title}
      className="property-card-image"
    />
  )
}

PropertyCard.Title = function PropertyCardTitle() {
  const { property } = usePropertyCardContext()
  return <h3 className="property-card-title">{property.title}</h3>
}

PropertyCard.Price = function PropertyCardPrice() {
  const { property } = usePropertyCardContext()
  return (
    <span className="property-card-price">
      {formatCurrency(property.price, property.currency)}
    </span>
  )
}

PropertyCard.SelectButton = function PropertyCardSelectButton() {
  const { isSelected, onSelect } = usePropertyCardContext()
  return (
    <Button 
      variant={isSelected ? "default" : "outline"}
      onClick={onSelect}
    >
      {isSelected ? "Selected" : "Select"}
    </Button>
  )
}

// Usage
<PropertyCard property={property} isSelected={selected} onSelect={handleSelect}>
  <PropertyCard.Image />
  <PropertyCard.Title />
  <PropertyCard.Price />
  <PropertyCard.SelectButton />
</PropertyCard>
```

### Render Props Pattern for Maximum Reusability

```typescript
// ✅ Render props for flexible UI composition
interface DataFetcherProps<T> {
  url: string
  children: (state: {
    data: T | null
    loading: boolean
    error: Error | null
    refetch: () => void
  }) => React.ReactNode
}

function DataFetcher<T>({ url, children }: DataFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch')
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [url])
  
  useEffect(() => {
    fetchData()
  }, [fetchData])
  
  return children({ data, loading, error, refetch: fetchData })
}

// Usage - highly reusable across different UI needs
<DataFetcher<Property[]> url="/api/properties">
  {({ data, loading, error, refetch }) => {
    if (loading) return <PropertyListSkeleton />
    if (error) return <ErrorMessage error={error} onRetry={refetch} />
    if (!data) return <EmptyState />
    
    return (
      <div className="property-grid">
        {data.map(property => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    )
  }}
</DataFetcher>
```

### Higher-Order Components for Cross-Cutting Concerns

```typescript
// ✅ HOC for authentication
interface WithAuthOptions {
  requiredRole?: UserRole
  redirectTo?: string
  fallbackComponent?: React.ComponentType
}

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const {
    requiredRole,
    redirectTo = '/auth/login',
    fallbackComponent: FallbackComponent
  } = options
  
  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useAuth()
    const router = useRouter()
    
    useEffect(() => {
      if (!loading && !user) {
        router.push(redirectTo)
      }
    }, [user, loading, router])
    
    if (loading) return <LoadingSpinner />
    
    if (!user) {
      return FallbackComponent ? <FallbackComponent /> : null
    }
    
    if (requiredRole && user.role !== requiredRole) {
      return <UnauthorizedAccess requiredRole={requiredRole} />
    }
    
    return <WrappedComponent {...props} />
  }
}

// Usage
const ProtectedPropertyForm = withAuth(PropertyForm, { 
  requiredRole: 'AGENCY',
  fallbackComponent: ContactSalesTeam 
})
```

## Clean Code Enhancements

### Command Pattern for Actions

```typescript
// ✅ Command pattern for undo/redo functionality
interface Command {
  execute(): Promise<void>
  undo(): Promise<void>
  getDescription(): string
}

class CreatePropertyCommand implements Command {
  private createdProperty: Property | null = null
  
  constructor(
    private propertyData: CreatePropertyInput,
    private propertyService: PropertyService
  ) {}
  
  async execute(): Promise<void> {
    this.createdProperty = await this.propertyService.create(this.propertyData)
  }
  
  async undo(): Promise<void> {
    if (this.createdProperty) {
      await this.propertyService.delete(this.createdProperty.id)
    }
  }
  
  getDescription(): string {
    return `Create property: ${this.propertyData.title}`
  }
}

class UpdatePropertyCommand implements Command {
  private previousData: Property | null = null
  
  constructor(
    private propertyId: string,
    private updates: Partial<Property>,
    private propertyService: PropertyService
  ) {}
  
  async execute(): Promise<void> {
    this.previousData = await this.propertyService.fetch(this.propertyId)
    await this.propertyService.update(this.propertyId, this.updates)
  }
  
  async undo(): Promise<void> {
    if (this.previousData) {
      await this.propertyService.update(this.propertyId, this.previousData)
    }
  }
  
  getDescription(): string {
    return `Update property: ${this.propertyId}`
  }
}

// Command manager for undo/redo
class CommandManager {
  private history: Command[] = []
  private currentIndex = -1
  
  async executeCommand(command: Command): Promise<void> {
    await command.execute()
    
    // Remove any commands after current index (when redoing then executing new command)
    this.history = this.history.slice(0, this.currentIndex + 1)
    this.history.push(command)
    this.currentIndex++
  }
  
  async undo(): Promise<void> {
    if (this.canUndo()) {
      const command = this.history[this.currentIndex]
      await command.undo()
      this.currentIndex--
    }
  }
  
  async redo(): Promise<void> {
    if (this.canRedo()) {
      this.currentIndex++
      const command = this.history[this.currentIndex]
      await command.execute()
    }
  }
  
  canUndo(): boolean {
    return this.currentIndex >= 0
  }
  
  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1
  }
}
```

### Observer Pattern for Real-time Updates

```typescript
// ✅ Observer pattern for property updates
interface PropertyObserver {
  onPropertyUpdated(property: Property): void
  onPropertyDeleted(propertyId: string): void
}

class PropertyEventManager {
  private observers: Set<PropertyObserver> = new Set()
  
  subscribe(observer: PropertyObserver): () => void {
    this.observers.add(observer)
    
    // Return unsubscribe function
    return () => {
      this.observers.delete(observer)
    }
  }
  
  notifyPropertyUpdated(property: Property): void {
    this.observers.forEach(observer => {
      observer.onPropertyUpdated(property)
    })
  }
  
  notifyPropertyDeleted(propertyId: string): void {
    this.observers.forEach(observer => {
      observer.onPropertyDeleted(propertyId)
    })
  }
}

// ✅ Hook that implements observer
export function usePropertyUpdates(propertyIds: string[]) {
  const [properties, setProperties] = useState<Map<string, Property>>(new Map())
  const eventManager = useContext(PropertyEventManagerContext)
  
  useEffect(() => {
    const observer: PropertyObserver = {
      onPropertyUpdated(property: Property) {
        if (propertyIds.includes(property.id)) {
          setProperties(prev => new Map(prev).set(property.id, property))
        }
      },
      
      onPropertyDeleted(propertyId: string) {
        if (propertyIds.includes(propertyId)) {
          setProperties(prev => {
            const next = new Map(prev)
            next.delete(propertyId)
            return next
          })
        }
      }
    }
    
    return eventManager.subscribe(observer)
  }, [propertyIds, eventManager])
  
  return Array.from(properties.values())
}
```

### Factory Pattern for Component Creation

```typescript
// ✅ Factory pattern for dynamic component creation
interface ComponentFactory<T> {
  create(type: string, props: T): React.ReactElement
}

class PropertyCardFactory implements ComponentFactory<PropertyCardProps> {
  private components = new Map<string, React.ComponentType<PropertyCardProps>>([
    ['featured', FeaturedPropertyCard],
    ['compact', CompactPropertyCard],
    ['detailed', DetailedPropertyCard],
    ['gallery', GalleryPropertyCard]
  ])
  
  create(type: string, props: PropertyCardProps): React.ReactElement {
    const Component = this.components.get(type)
    
    if (!Component) {
      throw new Error(`Unknown property card type: ${type}`)
    }
    
    return React.createElement(Component, props)
  }
  
  register(type: string, component: React.ComponentType<PropertyCardProps>): void {
    this.components.set(type, component)
  }
}

// Usage
const cardFactory = new PropertyCardFactory()

function PropertyList({ properties, displayType }: PropertyListProps) {
  return (
    <div className="property-list">
      {properties.map(property => 
        cardFactory.create(displayType, { 
          key: property.id, 
          property 
        })
      )}
    </div>
  )
}
```

## Enhanced Error Handling

### Custom Error Hierarchy

```typescript
// ✅ Proper error hierarchy
abstract class AventError extends Error {
  abstract readonly code: string
  abstract readonly statusCode: number
  
  constructor(message: string, public readonly context?: Record<string, unknown>) {
    super(message)
    this.name = this.constructor.name
  }
}

class PropertyNotFoundError extends AventError {
  readonly code = 'PROPERTY_NOT_FOUND'
  readonly statusCode = 404
  
  constructor(propertyId: string) {
    super(`Property with ID ${propertyId} not found`, { propertyId })
  }
}

class InsufficientPermissionsError extends AventError {
  readonly code = 'INSUFFICIENT_PERMISSIONS'
  readonly statusCode = 403
  
  constructor(requiredRole: string, userRole: string) {
    super(`Action requires ${requiredRole} role, user has ${userRole}`, {
      requiredRole,
      userRole
    })
  }
}

class PaymentProcessingError extends AventError {
  readonly code = 'PAYMENT_FAILED'
  readonly statusCode = 402
  
  constructor(reason: string, amount: number) {
    super(`Payment processing failed: ${reason}`, { amount })
  }
}

// ✅ Error boundary with proper error handling
class PropertyErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (error instanceof AventError) {
      // Log business errors differently
      console.error('Business Logic Error:', {
        code: error.code,
        message: error.message,
        context: error.context,
        componentStack: errorInfo.componentStack
      })
    } else {
      // Log technical errors
      console.error('Technical Error:', error, errorInfo)
    }
  }
  
  render() {
    if (this.state.hasError) {
      const error = this.state.error
      
      if (error instanceof PropertyNotFoundError) {
        return <PropertyNotFound propertyId={error.context?.propertyId as string} />
      }
      
      if (error instanceof InsufficientPermissionsError) {
        return <UnauthorizedAccess requiredRole={error.context?.requiredRole as string} />
      }
      
      return <GenericErrorFallback error={error} />
    }
    
    return this.props.children
  }
}
```

## Performance Optimization Patterns

### Virtualization for Large Lists

```typescript
// ✅ Virtual scrolling for property lists
import { FixedSizeList as List } from 'react-window'

interface VirtualPropertyListProps {
  properties: Property[]
  itemHeight: number
  height: number
}

function VirtualPropertyList({ properties, itemHeight, height }: VirtualPropertyListProps) {
  const PropertyItem = useCallback(({ index, style }: { index: number; style: CSSProperties }) => {
    const property = properties[index]
    
    return (
      <div style={style}>
        <PropertyCard property={property} />
      </div>
    )
  }, [properties])
  
  return (
    <List
      height={height}
      itemCount={properties.length}
      itemSize={itemHeight}
      width="100%"
    >
      {PropertyItem}
    </List>
  )
}
```

### Memoization Strategies

```typescript
// ✅ Advanced memoization patterns
const PropertyCardMemo = React.memo(
  PropertyCard,
  (prevProps, nextProps) => {
    // Custom comparison logic
    return (
      prevProps.property.id === nextProps.property.id &&
      prevProps.property.updatedAt === nextProps.property.updatedAt &&
      prevProps.isSelected === nextProps.isSelected
    )
  }
)

// ✅ Memoized selectors
const selectPropertiesByLocation = createSelector(
  [(state: RootState) => state.properties.items, (_, location: string) => location],
  (properties, location) => properties.filter(p => p.location === location)
)

// ✅ Memoized expensive calculations
function usePropertyStats(properties: Property[]) {
  return useMemo(() => {
    const totalValue = properties.reduce((sum, p) => sum + p.price, 0)
    const averagePrice = totalValue / properties.length
    const priceRanges = {
      budget: properties.filter(p => p.price < 100000).length,
      mid: properties.filter(p => p.price >= 100000 && p.price < 500000).length,
      luxury: properties.filter(p => p.price >= 500000).length
    }
    
    return { totalValue, averagePrice, priceRanges }
  }, [properties])
}
```

## Validation Enhancements

### Builder Pattern for Complex Validation

```typescript
// ✅ Validation builder pattern
class PropertyValidationBuilder {
  private rules: ValidationRule[] = []
  
  requireTitle(minLength = 1): this {
    this.rules.push({
      field: 'title',
      validate: (value: unknown) => 
        typeof value === 'string' && value.length >= minLength,
      message: `Title must be at least ${minLength} characters`
    })
    return this
  }
  
  requirePrice(min = 0): this {
    this.rules.push({
      field: 'price',
      validate: (value: unknown) => 
        typeof value === 'number' && value > min,
      message: `Price must be greater than ${min}`
    })
    return this
  }
  
  requireLocation(): this {
    this.rules.push({
      field: 'location',
      validate: (value: unknown) => 
        typeof value === 'string' && 
        ['punta-del-este', 'jose-ignacio', 'piriapolis'].includes(value),
      message: 'Location must be a valid Uruguay coastal city'
    })
    return this
  }
  
  requireImages(minCount = 1): this {
    this.rules.push({
      field: 'images',
      validate: (value: unknown) => 
        Array.isArray(value) && value.length >= minCount,
      message: `At least ${minCount} image(s) required`
    })
    return this
  }
  
  build(): PropertyValidator {
    return new PropertyValidator(this.rules)
  }
}

class PropertyValidator {
  constructor(private rules: ValidationRule[]) {}
  
  validate(data: unknown): ValidationResult {
    const errors: ValidationError[] = []
    
    for (const rule of this.rules) {
      const fieldValue = (data as Record<string, unknown>)?.[rule.field]
      
      if (!rule.validate(fieldValue)) {
        errors.push({
          field: rule.field,
          message: rule.message
        })
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

// Usage
const validator = new PropertyValidationBuilder()
  .requireTitle(5)
  .requirePrice(50000)
  .requireLocation()
  .requireImages(3)
  .build()

const result = validator.validate(propertyData)
```

## Repository Pattern for Data Access

```typescript
// ✅ Repository pattern with proper abstraction
interface Repository<T, K = string> {
  findById(id: K): Promise<T | null>
  findMany(criteria: SearchCriteria): Promise<T[]>
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>
  update(id: K, data: Partial<T>): Promise<T>
  delete(id: K): Promise<void>
}

class SupabasePropertyRepository implements Repository<Property> {
  constructor(private supabase: SupabaseClient) {}
  
  async findById(id: string): Promise<Property | null> {
    const { data, error } = await this.supabase
      .from('properties')
      .select(`
        *,
        agency:agencies(*),
        images:property_images(*),
        amenities:property_amenities(*)
      `)
      .eq('id', id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw new DatabaseError('Failed to fetch property', { id, error })
    }
    
    return this.mapToProperty(data)
  }
  
  async findMany(criteria: PropertySearchCriteria): Promise<Property[]> {
    let query = this.supabase
      .from('properties')
      .select('*, agency:agencies(*), images:property_images(*)')
    
    if (criteria.location) {
      query = query.eq('location', criteria.location)
    }
    
    if (criteria.priceRange) {
      query = query
        .gte('price', criteria.priceRange.min)
        .lte('price', criteria.priceRange.max)
    }
    
    if (criteria.propertyType) {
      query = query.eq('property_type', criteria.propertyType)
    }
    
    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(criteria.limit || 50)
    
    if (error) {
      throw new DatabaseError('Failed to fetch properties', { criteria, error })
    }
    
    return data.map(item => this.mapToProperty(item))
  }
  
  private mapToProperty(data: any): Property {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      price: data.price,
      currency: data.currency,
      location: data.location,
      propertyType: data.property_type,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      areaM2: data.area_m2,
      agency: data.agency,
      images: data.images?.map((img: any) => img.url) || [],
      amenities: data.amenities?.map((a: any) => a.name) || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at
    }
  }
}
```