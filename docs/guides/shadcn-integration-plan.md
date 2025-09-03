# shadcn/ui Integration Plan - Avent Properties

## 🎯 **Integration Objectives**

This plan integrates shadcn/ui components with our established UI/UX standards and SOLID principles to create:
- **Improved Readability**: Clean, consistent component interfaces
- **Better Separation of Concerns**: UI components separate from business logic
- **Reusable Components**: Compound components with proper composition
- **Accessibility Compliance**: WCAG 2.1 AA standards maintained
- **Performance Optimization**: Efficient rendering and state management

---

## 🏗️ **Architecture Integration**

### **Component Hierarchy**
```
┌─────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                     │
│  - Services, Hooks, Validation, Error Handling            │
├─────────────────────────────────────────────────────────────┤
│                    Component Composition Layer              │
│  - Compound Components, Render Props, HOCs                │
├─────────────────────────────────────────────────────────────┤
│                    shadcn/ui Base Layer                    │
│  - Button, Card, Input, Dialog, etc.                      │
├─────────────────────────────────────────────────────────────┤
│                    Styling & Theme Layer                   │
│  - TailwindCSS, Custom CSS, Design Tokens                 │
└─────────────────────────────────────────────────────────────┘
```

### **SOLID Principles Implementation**
- **Single Responsibility**: Each component has one clear purpose
- **Open/Closed**: Extensible through composition, not modification
- **Liskov Substitution**: Components can be swapped for variants
- **Interface Segregation**: Focused prop interfaces
- **Dependency Inversion**: Depend on abstractions, not concretions

---

## 🎨 **Component Integration Strategy**

### **1. Form Components with Validation**

#### **Enhanced Input Field Component**
```typescript
// ✅ Compound component with validation integration
interface InputFieldProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'password' | 'number'
  required?: boolean
  placeholder?: string
  error?: string
  description?: string
  disabled?: boolean
}

export function InputField({ 
  label, 
  name, 
  type = 'text',
  required = false,
  placeholder,
  error,
  description,
  disabled = false
}: InputFieldProps) {
  const id = `input-${name}`
  
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      <Input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "transition-colors",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        aria-describedby={cn(
          error && `${id}-error`,
          description && `${id}-description`
        )}
        aria-invalid={!!error}
        aria-required={required}
      />
      
      {description && (
        <p id={`${id}-description`} className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
      
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

// ✅ Usage with form validation
function PropertyForm() {
  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    mode: 'onBlur'
  })
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <InputField
          label="Property Title"
          name="title"
          required
          placeholder="Enter property title"
          error={form.formState.errors.title?.message}
          description="A descriptive title for your property listing"
        />
        
        <InputField
          label="Price"
          name="price"
          type="number"
          required
          placeholder="0"
          error={form.formState.errors.price?.message}
          description="Property price in USD"
        />
        
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Creating...' : 'Create Property'}
        </Button>
      </form>
    </Form>
  )
}
```

#### **Enhanced Select Component**
```typescript
// ✅ Compound select with search and accessibility
interface EnhancedSelectProps<T> {
  label: string
  name: string
  options: T[]
  value?: T
  onChange: (value: T) => void
  getOptionLabel: (option: T) => string
  getOptionValue: (option: T) => string
  placeholder?: string
  required?: boolean
  error?: string
  disabled?: boolean
  searchable?: boolean
}

export function EnhancedSelect<T>({
  label,
  name,
  options,
  value,
  onChange,
  getOptionLabel,
  getOptionValue,
  placeholder = "Select an option",
  required = false,
  error,
  disabled = false,
  searchable = false
}: EnhancedSelectProps<T>) {
  const id = `select-${name}`
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchValue) return options
    
    return options.filter(option =>
      getOptionLabel(option).toLowerCase().includes(searchValue.toLowerCase())
    )
  }, [options, searchValue, searchable])
  
  const selectedOption = useMemo(() => {
    return value ? options.find(option => getOptionValue(option) === getOptionValue(value)) : null
  }, [options, value, getOptionValue])
  
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between",
              error && "border-red-500",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={disabled}
            aria-describedby={error ? `${id}-error` : undefined}
            aria-invalid={!!error}
            aria-required={required}
          >
            {selectedOption ? getOptionLabel(selectedOption) : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-full p-0" align="start">
          {searchable && (
            <div className="p-2 border-b">
              <Input
                placeholder="Search options..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="h-8"
              />
            </div>
          )}
          
          <Command>
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={getOptionValue(option)}
                  value={getOptionValue(option)}
                  onSelect={() => {
                    onChange(option)
                    setOpen(false)
                    setSearchValue("")
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      getOptionValue(option) === getOptionValue(value) 
                        ? "opacity-100" 
                        : "opacity-0"
                    )}
                  />
                  {getOptionLabel(option)}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
```

### **2. Data Display Components**

#### **Enhanced Property Card**
```typescript
// ✅ Compound component with proper separation of concerns
interface PropertyCardProps {
  property: Property
  variant?: 'default' | 'compact' | 'featured'
  isSelected?: boolean
  onSelect?: (property: Property) => void
  onBookmark?: (property: Property) => void
  onShare?: (property: Property) => void
}

export function PropertyCard({
  property,
  variant = 'default',
  isSelected = false,
  onSelect,
  onBookmark,
  onShare
}: PropertyCardProps) {
  const { isBookmarked, toggleBookmark } = useBookmark(property.id)
  const { isInWishlist, toggleWishlist } = useWishlist(property.id)
  
  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-lg",
      isSelected && "ring-2 ring-primary ring-offset-2",
      variant === 'featured' && "border-2 border-primary"
    )}>
      <PropertyCard.Image property={property} variant={variant} />
      
      <CardHeader className="space-y-2">
        <PropertyCard.Title property={property} />
        <PropertyCard.Location property={property} />
        <PropertyCard.Price property={property} />
      </CardHeader>
      
      <CardContent className="space-y-3">
        <PropertyCard.Details property={property} />
        <PropertyCard.Amenities property={property} />
      </CardContent>
      
      <CardFooter className="flex justify-between items-center">
        <PropertyCard.Actions
          property={property}
          isSelected={isSelected}
          isBookmarked={isBookmarked}
          isInWishlist={isInWishlist}
          onSelect={onSelect}
          onBookmark={toggleBookmark}
          onWishlist={toggleWishlist}
          onShare={onShare}
        />
      </CardFooter>
    </Card>
  )
}

// ✅ Sub-components with focused responsibilities
PropertyCard.Image = function PropertyCardImage({ 
  property, 
  variant 
}: { 
  property: Property
  variant: PropertyCardProps['variant']
}) {
  const [imageIndex, setImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  
  return (
    <div className="relative aspect-video overflow-hidden rounded-t-lg">
      <Image
        src={property.images[imageIndex] || '/placeholder-property.jpg'}
        alt={property.title}
        fill
        className={cn(
          "object-cover transition-opacity duration-300",
          isLoading && "opacity-0"
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
      />
      
      {property.images.length > 1 && (
        <div className="absolute bottom-2 right-2 flex space-x-1">
          {property.images.map((_, index) => (
            <Button
              key={index}
              variant="secondary"
              size="sm"
              className={cn(
                "h-2 w-2 p-0 rounded-full",
                index === imageIndex ? "bg-primary" : "bg-white/50"
              )}
              onClick={() => setImageIndex(index)}
              aria-label={`View image ${index + 1} of ${property.images.length}`}
            />
          ))}
        </div>
      )}
      
      {variant === 'featured' && (
        <Badge className="absolute top-2 left-2" variant="secondary">
          Featured
        </Badge>
      )}
      
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
    </div>
  )
}

PropertyCard.Title = function PropertyCardTitle({ property }: { property: Property }) {
  return (
    <CardTitle className="text-lg font-semibold line-clamp-2">
      {property.title}
    </CardTitle>
  )
}

PropertyCard.Location = function PropertyCardLocation({ property }: { property: Property }) {
  return (
    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
      <MapPin className="h-4 w-4" />
      <span>{property.location}</span>
    </div>
  )
}

PropertyCard.Price = function PropertyCardPrice({ property }: { property: Property }) {
  return (
    <div className="text-2xl font-bold text-primary">
      {formatCurrency(property.price, property.currency)}
    </div>
  )
}

PropertyCard.Details = function PropertyCardDetails({ property }: { property: Property }) {
  return (
    <div className="grid grid-cols-3 gap-4 text-sm">
      <div className="flex items-center space-x-1">
        <Bed className="h-4 w-4 text-muted-foreground" />
        <span>{property.bedrooms} beds</span>
      </div>
      <div className="flex items-center space-x-1">
        <Bath className="h-4 w-4 text-muted-foreground" />
        <span>{property.bathrooms} baths</span>
      </div>
      <div className="flex items-center space-x-1">
        <Square className="h-4 w-4 text-muted-foreground" />
        <span>{property.areaM2}m²</span>
      </div>
    </div>
  )
}

PropertyCard.Amenities = function PropertyCardAmenities({ property }: { property: Property }) {
  const [showAll, setShowAll] = useState(false)
  const visibleAmenities = showAll ? property.amenities : property.amenities.slice(0, 3)
  
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {visibleAmenities.map((amenity) => (
          <Badge key={amenity} variant="outline" className="text-xs">
            {amenity}
          </Badge>
        ))}
      </div>
      
      {property.amenities.length > 3 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAll(!showAll)}
          className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
        >
          {showAll ? 'Show less' : `+${property.amenities.length - 3} more`}
        </Button>
      )}
    </div>
  )
}

PropertyCard.Actions = function PropertyCardActions({
  property,
  isSelected,
  isBookmarked,
  isInWishlist,
  onSelect,
  onBookmark,
  onWishlist,
  onShare
}: {
  property: Property
  isSelected: boolean
  isBookmarked: boolean
  isInWishlist: boolean
  onSelect?: (property: Property) => void
  onBookmark?: () => void
  onWishlist?: () => void
  onShare?: (property: Property) => void
}) {
  return (
    <div className="flex items-center space-x-2">
      {onSelect && (
        <Button
          variant={isSelected ? "default" : "outline"}
          size="sm"
          onClick={() => onSelect(property)}
          aria-label={isSelected ? "Deselect property" : "Select property"}
        >
          {isSelected ? "Selected" : "Select"}
        </Button>
      )}
      
      <div className="flex items-center space-x-1">
        {onBookmark && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBookmark}
            aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            <Bookmark className={cn(
              "h-4 w-4",
              isBookmarked ? "fill-current" : ""
            )} />
          </Button>
        )}
        
        {onWishlist && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onWishlist}
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={cn(
              "h-4 w-4",
              isInWishlist ? "fill-current text-red-500" : ""
            )} />
          </Button>
        )}
        
        {onShare && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onShare(property)}
            aria-label="Share property"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
```

### **3. Layout and Navigation Components**

#### **Enhanced Navigation Bar**
```typescript
// ✅ Responsive navigation with proper accessibility
interface NavigationProps {
  user?: User | null
  onSignIn?: () => void
  onSignOut?: () => void
}

export function Navigation({ user, onSignIn, onSignOut }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  
  const navigationItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/listings', label: 'Properties', icon: Building2 },
    { href: '/about', label: 'About', icon: Info },
    { href: '/contact', label: 'Contact', icon: Mail }
  ]
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Avent Properties</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
          
          {/* User Actions */}
          <div className="flex items-center space-x-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <Settings className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={onSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={onSignIn} variant="outline">
                Sign In
              </Button>
            )}
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <Collapsible open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <CollapsibleContent className="md:hidden">
          <div className="border-t bg-background">
            <div className="container mx-auto px-4 py-4">
              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        isActive 
                          ? "bg-primary text-primary-foreground" 
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </header>
  )
}
```

---

## 🔧 **Implementation Guidelines**

### **1. Component Installation**
```bash
# Install required shadcn components
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add select
npx shadcn@latest add popover
npx shadcn@latest add command
npx shadcn@latest add badge
npx shadcn@latest add avatar
npx shadcn@latest add dropdown-menu
npx shadcn@latest add collapsible
npx shadcn@latest add form
npx shadcn@latest add dialog
npx shadcn@latest add sheet
npx shadcn@latest add tabs
npx shadcn@latest add accordion
```

### **2. Custom Hooks Integration**
```typescript
// ✅ Custom hooks for business logic
export function useBookmark(propertyId: string) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const toggleBookmark = useCallback(async () => {
    setIsLoading(true)
    try {
      if (isBookmarked) {
        await removeBookmark(propertyId)
        setIsBookmarked(false)
      } else {
        await addBookmark(propertyId)
        setIsBookmarked(true)
      }
    } catch (error) {
      // Error handling
    } finally {
      setIsLoading(false)
    }
  }, [propertyId, isBookmarked])
  
  return { isBookmarked, isLoading, toggleBookmark }
}

export function useWishlist(propertyId: string) {
  // Similar implementation for wishlist functionality
}
```

### **3. Form Validation Integration**
```typescript
// ✅ Zod schemas for form validation
const propertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.number().positive("Price must be positive"),
  location: z.enum(['punta-del-este', 'jose-ignacio', 'piriapolis']),
  propertyType: z.enum(['apartment', 'house', 'villa', 'land']),
  bedrooms: z.number().int().min(0),
  bathrooms: z.number().int().min(0),
  areaM2: z.number().positive("Area must be positive"),
  images: z.array(z.string().url()).min(1, "At least one image is required")
})

type PropertyFormData = z.infer<typeof propertySchema>
```

---

## 🧪 **Testing Strategy**

### **1. Component Testing**
```typescript
// ✅ Test compound components
describe('PropertyCard', () => {
  const mockProperty = createMockProperty()
  
  it('renders all sub-components correctly', () => {
    render(
      <PropertyCard property={mockProperty}>
        <PropertyCard.Image property={mockProperty} />
        <PropertyCard.Title property={mockProperty} />
        <PropertyCard.Price property={mockProperty} />
      </PropertyCard>
    )
    
    expect(screen.getByAltText(mockProperty.title)).toBeInTheDocument()
    expect(screen.getByText(mockProperty.title)).toBeInTheDocument()
    expect(screen.getByText(formatCurrency(mockProperty.price))).toBeInTheDocument()
  })
  
  it('handles user interactions correctly', async () => {
    const onSelect = jest.fn()
    
    render(
      <PropertyCard property={mockProperty} onSelect={onSelect}>
        <PropertyCard.Actions
          property={mockProperty}
          isSelected={false}
          isBookmarked={false}
          isInWishlist={false}
          onSelect={onSelect}
        />
      </PropertyCard>
    )
    
    const selectButton = screen.getByRole('button', { name: /select property/i })
    await userEvent.click(selectButton)
    
    expect(onSelect).toHaveBeenCalledWith(mockProperty)
  })
})
```

### **2. Accessibility Testing**
```typescript
// ✅ Test accessibility features
describe('PropertyCard Accessibility', () => {
  it('has proper ARIA labels', () => {
    render(<PropertyCard property={mockProperty} />)
    
    expect(screen.getByRole('img', { name: mockProperty.title })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add bookmark/i })).toBeInTheDocument()
  })
  
  it('supports keyboard navigation', async () => {
    render(<PropertyCard property={mockProperty} />)
    
    const card = screen.getByRole('article')
    card.focus()
    
    await userEvent.keyboard('{Tab}')
    expect(screen.getByRole('button', { name: /select property/i })).toHaveFocus()
  })
})
```

---

## 📱 **Responsive Design Implementation**

### **1. Mobile-First Approach**
```typescript
// ✅ Responsive utility classes
<div className="
  grid grid-cols-1 gap-4
  sm:grid-cols-2 
  md:grid-cols-3 
  lg:grid-cols-4 
  xl:grid-cols-5
">
  {properties.map(property => (
    <PropertyCard key={property.id} property={property} />
  ))}
</div>
```

### **2. Touch-Friendly Interactions**
```typescript
// ✅ Touch target sizing
<Button
  className="h-11 min-w-[44px] px-3" // Minimum 44x44px touch target
  variant="ghost"
  size="sm"
>
  <Heart className="h-5 w-5" />
</Button>
```

---

## 🚀 **Performance Optimization**

### **1. Component Memoization**
```typescript
// ✅ Memoize expensive components
export const PropertyCard = React.memo(function PropertyCard(props: PropertyCardProps) {
  // Component implementation
}, (prevProps, nextProps) => {
  // Custom comparison for performance
  return (
    prevProps.property.id === nextProps.property.id &&
    prevProps.property.updatedAt === nextProps.property.updatedAt &&
    prevProps.isSelected === nextProps.isSelected
  )
})
```

### **2. Lazy Loading**
```typescript
// ✅ Lazy load non-critical components
const PropertyGallery = lazy(() => import('./PropertyGallery'))
const PropertyMap = lazy(() => import('./PropertyMap'))

function PropertyDetails({ property }: { property: Property }) {
  return (
    <div>
      <Suspense fallback={<Skeleton className="h-64" />}>
        <PropertyGallery images={property.images} />
      </Suspense>
      
      <Suspense fallback={<Skeleton className="h-96" />}>
        <PropertyMap location={property.location} />
      </Suspense>
    </div>
  )
}
```

---

## 📋 **Implementation Checklist**

### **Phase 1: Core Components**
- [ ] Install shadcn/ui base components
- [ ] Create enhanced form components
- [ ] Implement compound property card
- [ ] Add responsive navigation
- [ ] Set up custom hooks for business logic

### **Phase 2: Advanced Features**
- [ ] Add search and filtering components
- [ ] Implement modal and dialog systems
- [ ] Create data table components
- [ ] Add notification and toast systems
- [ ] Implement loading and skeleton states

### **Phase 3: Optimization**
- [ ] Performance testing and optimization
- [ ] Accessibility audit and improvements
- [ ] Mobile responsiveness testing
- [ ] Bundle size optimization
- [ ] Documentation updates

---

## 🎯 **Expected Outcomes**

### **Immediate Benefits**
- **Improved Readability**: Clean, consistent component interfaces
- **Better Maintainability**: Separated concerns and reusable patterns
- **Enhanced Accessibility**: WCAG 2.1 AA compliance
- **Consistent Design**: Unified design system across components

### **Long-term Benefits**
- **Developer Experience**: Faster development with reusable components
- **Performance**: Optimized rendering and state management
- **Scalability**: Easy to extend and modify components
- **Quality**: Better testing coverage and error handling

---

**This integration plan provides a solid foundation for building maintainable, accessible, and performant components while following established UI/UX standards and SOLID principles.**
