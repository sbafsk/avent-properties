# shadcn/ui Integration Guide - Avent Properties

## 🎯 **Overview**

This guide covers the complete shadcn/ui integration for Avent Properties, including implementation strategy, practical examples, and best practices. All shadcn/ui related information is consolidated here to maintain single source of truth.

---

## 🚀 **Quick Start Implementation**

### **Install Required Components**

```bash
# Navigate to your project directory
cd avent-properties

# Install core shadcn components
npx shadcn@latest add button card input label form select popover command badge avatar dropdown-menu collapsible dialog tabs skeleton
```

### **Component Architecture Strategy**

We follow **composition over replacement** principles:
- **Base Components**: Use shadcn/ui components directly
- **Wrapper Components**: Create enhanced versions that extend base functionality
- **No Duplication**: Never replace shadcn/ui components, only enhance them

---

## 🧩 **Enhanced Form Components**

### **InputField Wrapper Component**

```typescript
// components/ui/input-field.tsx
import React from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface InputFieldProps {
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

export function InputField({
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
}: InputFieldProps) {
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

### **SelectField Wrapper Component**

```typescript
// components/ui/select-field.tsx
import React, { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Check, ChevronsUpDown } from 'lucide-react'

interface SelectFieldProps<T> {
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

export function SelectField<T>({
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
}: SelectFieldProps<T>) {
  const id = `select-${name}`
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchValue) return options
    
    return options.filter(option =>
      getOptionLabel(option).toLowerCase().includes(searchValue.toLowerCase())
    )
  }, [options, searchValue, searchable, getOptionLabel])
  
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
                      value && getOptionValue(option) === getOptionValue(value)
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

## 🏠 **Property Components**

### **PropertyCard with Compound Pattern**

```typescript
// components/property/property-card.tsx
import React, { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bookmark, Heart, Share2, MapPin, Bed, Bath, Square } from 'lucide-react'

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

// Sub-components with focused responsibilities
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

// Additional sub-components would follow the same pattern...
```

### **PropertyForm with Validation**

```typescript
// components/property/property-form.tsx
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { InputField } from '@/components/ui/input-field'
import { SelectField } from '@/components/ui/select-field'

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
                  <InputField
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
                  <InputField
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
        
        {/* Additional form fields follow the same pattern... */}
        
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

## 🧪 **Testing Strategy**

### **Component Testing**

```typescript
// __tests__/components/input-field.test.tsx
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { InputField } from '@/components/ui/input-field'

describe('InputField', () => {
  const defaultProps = {
    label: 'Test Input',
    name: 'test',
    placeholder: 'Enter test value'
  }

  it('renders with label and placeholder', () => {
    render(<InputField {...defaultProps} />)
    
    expect(screen.getByLabelText('Test Input')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter test value')).toBeInTheDocument()
  })

  it('shows required indicator when required is true', () => {
    render(<InputField {...defaultProps} required />)
    
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('displays error message when error is provided', () => {
    const errorMessage = 'This field is required'
    render(<InputField {...defaultProps} error={errorMessage} />)
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
    expect(screen.getByText(errorMessage)).toHaveAttribute('role', 'alert')
  })

  // Additional tests...
})
```

---

## 📚 **Best Practices**

### **Component Design Principles**

1. **Composition Over Replacement**: Always extend shadcn/ui components, never replace them
2. **Single Responsibility**: Each component has one clear purpose
3. **Accessibility First**: Include proper ARIA attributes and keyboard navigation
4. **Type Safety**: Use TypeScript interfaces for all props
5. **Error Handling**: Provide clear error states and validation feedback

### **Performance Considerations**

1. **Memoization**: Use `useMemo` and `useCallback` for expensive operations
2. **Lazy Loading**: Implement image lazy loading and component code splitting
3. **Bundle Optimization**: Import only necessary dependencies
4. **Testing**: Ensure all components have comprehensive test coverage

### **Accessibility Standards**

1. **WCAG 2.1 AA Compliance**: Meet accessibility standards
2. **Keyboard Navigation**: Support full keyboard navigation
3. **Screen Reader Support**: Proper ARIA labels and descriptions
4. **Color Contrast**: Maintain sufficient contrast ratios
5. **Focus Management**: Clear focus indicators and logical tab order

---

## 🔗 **Related Documentation**

- **Architecture Overview**: See `docs/architecture/overview.md`
- **Coding Standards**: See `standards/coding.md`
- **UI/UX Guidelines**: See `standards/ui.md`
- **Project Status**: See `docs/status/progress.yaml`

---

## 📝 **Implementation Checklist**

- [ ] Install shadcn/ui components
- [ ] Create InputField wrapper component
- [ ] Create SelectField wrapper component
- [ ] Implement PropertyCard with compound pattern
- [ ] Build PropertyForm with validation
- [ ] Add comprehensive tests
- [ ] Update documentation
- [ ] Verify accessibility compliance
- [ ] Run performance tests
- [ ] Deploy and monitor

---

## 🚀 **Next Steps**

1. **Immediate**: Use the wrapper components in your forms
2. **Short-term**: Extend with additional form field types
3. **Long-term**: Create more compound components following the same pattern

This guide serves as the single source of truth for all shadcn/ui integration needs in Avent Properties.
