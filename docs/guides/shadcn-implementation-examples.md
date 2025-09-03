# shadcn/ui Implementation Examples - Avent Properties

## 🚀 **Quick Start Implementation**

This guide provides practical examples to start implementing the shadcn/ui integration plan immediately.

---

## 📦 **Step 1: Install Required Components**

```bash
# Navigate to your project directory
cd avent-properties

# Install core shadcn components
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add form
npx shadcn@latest add select
npx shadcn@latest add popover
npx shadcn@latest add command
npx shadcn@latest add badge
npx shadcn@latest add avatar
npx shadcn@latest add dropdown-menu
npx shadcn@latest add collapsible
npx shadcn@latest add dialog
npx shadcn@latest add tabs
npx shadcn@latest add skeleton
```

---

## 🎯 **Step 2: Create Enhanced Form Components**

### **Enhanced Input Field Component**

Create `components/ui/enhanced-input.tsx`:

```typescript
import React from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface EnhancedInputProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  required?: boolean
  placeholder?: string
  error?: string
  description?: string
  disabled?: boolean
  className?: string
  value?: string
  onChange?: (value: string) => void
}

export function EnhancedInput({
  label,
  name,
  type = 'text',
  required = false,
  placeholder,
  error,
  description,
  disabled = false,
  className,
  value,
  onChange
}: EnhancedInputProps) {
  const id = `input-${name}`
  
  return (
    <div className={cn("space-y-2", className)}>
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
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
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
```

### **Enhanced Select Component**

Create `components/ui/enhanced-select.tsx`:

```typescript
import React, { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Check, ChevronsUpDown } from 'lucide-react'

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
  className?: string
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
  searchable = false,
  className
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
    <div className={cn("space-y-2", className)}>
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
          <Command>
            {searchable && (
              <CommandInput 
                placeholder="Search options..." 
                value={searchValue}
                onValueChange={setSearchValue}
              />
            )}
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

---

## 🏠 **Step 3: Create Enhanced Property Card**

### **Property Card Component**

Create `components/property/property-card.tsx`:

```typescript
import React, { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bookmark, Heart, Share2, MapPin, Bed, Bath, Square } from 'lucide-react'
import { formatCurrency } from '@/lib/formatting'

interface Property {
  id: string
  title: string
  description: string
  price: number
  currency: string
  location: string
  bedrooms: number
  bathrooms: number
  areaM2: number
  images: string[]
  amenities: string[]
}

interface PropertyCardProps {
  property: Property
  variant?: 'default' | 'compact' | 'featured'
  isSelected?: boolean
  onSelect?: (property: Property) => void
  onBookmark?: (property: Property) => void
  onShare?: (property: Property) => void
  className?: string
}

export function PropertyCard({
  property,
  variant = 'default',
  isSelected = false,
  onSelect,
  onBookmark,
  onShare,
  className
}: PropertyCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isInWishlist, setIsInWishlist] = useState(false)
  
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    onBookmark?.(property)
  }
  
  const handleWishlist = () => {
    setIsInWishlist(!isInWishlist)
  }
  
  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-lg",
      isSelected && "ring-2 ring-primary ring-offset-2",
      variant === 'featured' && "border-2 border-primary",
      className
    )}>
      <PropertyCardImage property={property} variant={variant} />
      
      <CardHeader className="space-y-2">
        <PropertyCardTitle property={property} />
        <PropertyCardLocation property={property} />
        <PropertyCardPrice property={property} />
      </CardHeader>
      
      <CardContent className="space-y-3">
        <PropertyCardDetails property={property} />
        <PropertyCardAmenities property={property} />
      </CardContent>
      
      <CardFooter className="flex justify-between items-center">
        <PropertyCardActions
          property={property}
          isSelected={isSelected}
          isBookmarked={isBookmarked}
          isInWishlist={isInWishlist}
          onSelect={onSelect}
          onBookmark={handleBookmark}
          onWishlist={handleWishlist}
          onShare={onShare}
        />
      </CardFooter>
    </Card>
  )
}

// Sub-components
function PropertyCardImage({ property, variant }: { property: Property; variant: PropertyCardProps['variant'] }) {
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

function PropertyCardTitle({ property }: { property: Property }) {
  return (
    <CardTitle className="text-lg font-semibold line-clamp-2">
      {property.title}
    </CardTitle>
  )
}

function PropertyCardLocation({ property }: { property: Property }) {
  return (
    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
      <MapPin className="h-4 w-4" />
      <span>{property.location}</span>
    </div>
  )
}

function PropertyCardPrice({ property }: { property: Property }) {
  return (
    <div className="text-2xl font-bold text-primary">
      {formatCurrency(property.price, property.currency)}
    </div>
  )
}

function PropertyCardDetails({ property }: { property: Property }) {
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

function PropertyCardAmenities({ property }: { property: Property }) {
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

function PropertyCardActions({
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

---

## 📝 **Step 4: Create Property Form**

### **Property Form Component**

Create `components/property/property-form.tsx`:

```typescript
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { EnhancedInput } from '@/components/ui/enhanced-input'
import { EnhancedSelect } from '@/components/ui/enhanced-select'

// Validation schema
const propertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.number().positive("Price must be positive"),
  location: z.enum(['punta-del-este', 'jose-ignacio', 'piriapolis']),
  propertyType: z.enum(['apartment', 'house', 'villa', 'land']),
  bedrooms: z.number().int().min(0),
  bathrooms: z.number().int().min(0),
  areaM2: z.number().positive("Area must be positive")
})

type PropertyFormData = z.infer<typeof propertySchema>

// Mock data for select options
const locationOptions = [
  { value: 'punta-del-este', label: 'Punta del Este' },
  { value: 'jose-ignacio', label: 'José Ignacio' },
  { value: 'piriapolis', label: 'Piriápolis' }
]

const propertyTypeOptions = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'villa', label: 'Villa' },
  { value: 'land', label: 'Land' }
]

interface PropertyFormProps {
  onSubmit: (data: PropertyFormData) => void
  initialData?: Partial<PropertyFormData>
  isLoading?: boolean
}

export function PropertyForm({ onSubmit, initialData, isLoading = false }: PropertyFormProps) {
  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      price: initialData?.price || 0,
      location: initialData?.location || 'punta-del-este',
      propertyType: initialData?.propertyType || 'apartment',
      bedrooms: initialData?.bedrooms || 0,
      bathrooms: initialData?.bathrooms || 0,
      areaM2: initialData?.areaM2 || 0
    },
    mode: 'onBlur'
  })
  
  const handleSubmit = (data: PropertyFormData) => {
    onSubmit(data)
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Title</FormLabel>
                <FormControl>
                  <EnhancedInput
                    label="Property Title"
                    name="title"
                    required
                    placeholder="Enter property title"
                    value={field.value}
                    onChange={field.onChange}
                    error={form.formState.errors.title?.message}
                    description="A descriptive title for your property listing"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <EnhancedInput
                    label="Price"
                    name="price"
                    type="number"
                    required
                    placeholder="0"
                    value={field.value.toString()}
                    onChange={(value) => field.onChange(parseFloat(value) || 0)}
                    error={form.formState.errors.price?.message}
                    description="Property price in USD"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <EnhancedInput
                  label="Description"
                  name="description"
                  required
                  placeholder="Describe your property..."
                  value={field.value}
                  onChange={field.onChange}
                  error={form.formState.errors.description?.message}
                  description="Detailed description of your property"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <EnhancedSelect
                    label="Location"
                    name="location"
                    options={locationOptions}
                    value={locationOptions.find(opt => opt.value === field.value)}
                    onChange={(option) => field.onChange(option.value)}
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => option.value}
                    required
                    error={form.formState.errors.location?.message}
                    description="Select the property location"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="propertyType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Type</FormLabel>
                <FormControl>
                  <EnhancedSelect
                    label="Property Type"
                    name="propertyType"
                    options={propertyTypeOptions}
                    value={propertyTypeOptions.find(opt => opt.value === field.value)}
                    onChange={(option) => field.onChange(option.value)}
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => option.value}
                    required
                    error={form.formState.errors.propertyType?.message}
                    description="Select the property type"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="bedrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bedrooms</FormLabel>
                <FormControl>
                  <EnhancedInput
                    label="Bedrooms"
                    name="bedrooms"
                    type="number"
                    required
                    placeholder="0"
                    value={field.value.toString()}
                    onChange={(value) => field.onChange(parseInt(value) || 0)}
                    error={form.formState.errors.bedrooms?.message}
                    description="Number of bedrooms"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="bathrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bathrooms</FormLabel>
                <FormControl>
                  <EnhancedInput
                    label="Bathrooms"
                    name="bathrooms"
                    type="number"
                    required
                    placeholder="0"
                    value={field.value.toString()}
                    onChange={(value) => field.onChange(parseInt(value) || 0)}
                    error={form.formState.errors.bathrooms?.message}
                    description="Number of bathrooms"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="areaM2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Area (m²)</FormLabel>
                <FormControl>
                  <EnhancedInput
                    label="Area (m²)"
                    name="areaM2"
                    type="number"
                    required
                    placeholder="0"
                    value={field.value.toString()}
                    onChange={(value) => field.onChange(parseFloat(value) || 0)}
                    error={form.formState.errors.areaM2?.message}
                    description="Property area in square meters"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Property'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
```

---

## 🧪 **Step 5: Create Tests**

### **Test File for Property Card**

Create `__tests__/components/property-card.test.tsx`:

```typescript
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { PropertyCard } from '@/components/property/property-card'

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />
  }
}))

const mockProperty = {
  id: '1',
  title: 'Luxury Beach Villa',
  description: 'Beautiful villa with ocean view',
  price: 1500000,
  currency: 'USD',
  location: 'Punta del Este',
  bedrooms: 4,
  bathrooms: 3,
  areaM2: 250,
  images: ['/image1.jpg', '/image2.jpg'],
  amenities: ['Pool', 'Garden', 'Ocean View', 'Garage']
}

describe('PropertyCard', () => {
  it('renders property information correctly', () => {
    render(<PropertyCard property={mockProperty} />)
    
    expect(screen.getByText('Luxury Beach Villa')).toBeInTheDocument()
    expect(screen.getByText('Punta del Este')).toBeInTheDocument()
    expect(screen.getByText('$1,500,000')).toBeInTheDocument()
    expect(screen.getByText('4 beds')).toBeInTheDocument()
    expect(screen.getByText('3 baths')).toBeInTheDocument()
    expect(screen.getByText('250m²')).toBeInTheDocument()
  })
  
  it('displays amenities correctly', () => {
    render(<PropertyCard property={mockProperty} />)
    
    expect(screen.getByText('Pool')).toBeInTheDocument()
    expect(screen.getByText('Garden')).toBeInTheDocument()
    expect(screen.getByText('Ocean View')).toBeInTheDocument()
    expect(screen.getByText('+1 more')).toBeInTheDocument()
  })
  
  it('handles bookmark action', () => {
    const onBookmark = jest.fn()
    render(<PropertyCard property={mockProperty} onBookmark={onBookmark} />)
    
    const bookmarkButton = screen.getByRole('button', { name: /add bookmark/i })
    fireEvent.click(bookmarkButton)
    
    expect(onBookmark).toHaveBeenCalledWith(mockProperty)
  })
  
  it('handles select action', () => {
    const onSelect = jest.fn()
    render(<PropertyCard property={mockProperty} onSelect={onSelect} />)
    
    const selectButton = screen.getByRole('button', { name: /select property/i })
    fireEvent.click(selectButton)
    
    expect(onSelect).toHaveBeenCalledWith(mockProperty)
  })
  
  it('shows featured badge when variant is featured', () => {
    render(<PropertyCard property={mockProperty} variant="featured" />)
    
    expect(screen.getByText('Featured')).toBeInTheDocument()
  })
  
  it('applies selected state styling', () => {
    render(<PropertyCard property={mockProperty} isSelected={true} onSelect={jest.fn()} />)
    
    const selectButton = screen.getByRole('button', { name: /deselect property/i })
    expect(selectButton).toHaveClass('bg-primary')
  })
})
```

---

## 🚀 **Step 6: Usage Examples**

### **Property List Page**

```typescript
// pages/properties.tsx or app/properties/page.tsx
import React, { useState } from 'react'
import { PropertyCard } from '@/components/property/property-card'
import { PropertyForm } from '@/components/property/property-form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

const mockProperties = [
  {
    id: '1',
    title: 'Luxury Beach Villa',
    description: 'Beautiful villa with ocean view',
    price: 1500000,
    currency: 'USD',
    location: 'Punta del Este',
    bedrooms: 4,
    bathrooms: 3,
    areaM2: 250,
    images: ['/image1.jpg', '/image2.jpg'],
    amenities: ['Pool', 'Garden', 'Ocean View', 'Garage']
  },
  // Add more mock properties...
]

export default function PropertiesPage() {
  const [properties, setProperties] = useState(mockProperties)
  const [selectedProperties, setSelectedProperties] = useState<string[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  
  const handlePropertySelect = (property: any) => {
    setSelectedProperties(prev => 
      prev.includes(property.id)
        ? prev.filter(id => id !== property.id)
        : [...prev, property.id]
    )
  }
  
  const handlePropertyBookmark = (property: any) => {
    console.log('Bookmarked:', property.title)
  }
  
  const handlePropertyShare = (property: any) => {
    console.log('Sharing:', property.title)
  }
  
  const handleFormSubmit = (data: any) => {
    const newProperty = {
      id: Date.now().toString(),
      ...data,
      images: ['/placeholder.jpg'],
      amenities: []
    }
    
    setProperties(prev => [newProperty, ...prev])
    setIsFormOpen(false)
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Properties</h1>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>Add Property</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Property</DialogTitle>
            </DialogHeader>
            <PropertyForm onSubmit={handleFormSubmit} />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {properties.map(property => (
          <PropertyCard
            key={property.id}
            property={property}
            isSelected={selectedProperties.includes(property.id)}
            onSelect={handlePropertySelect}
            onBookmark={handlePropertyBookmark}
            onShare={handlePropertyShare}
          />
        ))}
      </div>
      
      {selectedProperties.length > 0 && (
        <div className="fixed bottom-4 right-4">
          <Button size="lg">
            View Selected ({selectedProperties.length})
          </Button>
        </div>
      )}
    </div>
  )
}
```

---

## 📋 **Next Steps Checklist**

### **Immediate Actions**
- [ ] Install shadcn/ui components
- [ ] Create enhanced form components
- [ ] Implement property card component
- [ ] Add basic tests
- [ ] Create sample usage page

### **Follow-up Actions**
- [ ] Add more form validation
- [ ] Implement search and filtering
- [ ] Add loading states and skeletons
- [ ] Create more compound components
- [ ] Add accessibility improvements
- [ ] Performance optimization

---

**This implementation provides a solid foundation for building maintainable, accessible, and performant components using shadcn/ui while following established UI/UX standards and SOLID principles.**
