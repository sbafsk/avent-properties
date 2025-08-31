/**
 * PropertyFilter Flexible Compound Components with Context
 * 
 * Following Kent C. Dodds' Advanced React Patterns - Flexible Compound Components
 * This pattern uses React Context to share state across any level of the component tree,
 * enabling deeper component nesting and more flexible composition.
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { GlassCard } from './glass-card'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

// Types
export interface FilterState {
  priceRange: [number, number]
  bedrooms: number[]
  bathrooms: number[]
  propertyType: string[]
  location: string[]
  amenities: string[]
}

export interface FilterOptions {
  locations?: string[]
  propertyTypes?: string[]
  amenities?: string[]
  priceRange?: {
    min: number
    max: number
    step: number
  }
  bedroomOptions?: number[]
  bathroomOptions?: number[]
}

interface PropertyFilterContextValue {
  filters: FilterState
  searchQuery: string
  isOpen: boolean
  updateFilter: (key: keyof FilterState, value: number[] | [number, number] | string[]) => void
  updateSearchQuery: (query: string) => void
  clearFilters: () => void
  toggleOpen: () => void
  setOpen: (open: boolean) => void
  onFilterChange?: (filters: FilterState) => void
  onClose?: () => void
  options: FilterOptions
}

// Context
const PropertyFilterContext = createContext<PropertyFilterContextValue | undefined>(undefined)

// Custom hook to use the context
function usePropertyFilterContext() {
  const context = useContext(PropertyFilterContext)
  if (context === undefined) {
    throw new Error('PropertyFilter compound components must be used within PropertyFilter')
  }
  return context
}

// Default filter options
const defaultOptions: FilterOptions = {
  locations: ['Punta del Este', 'José Ignacio', 'Piriápolis', 'La Barra', 'Manantiales'],
  propertyTypes: ['Villa', 'Apartment', 'Penthouse', 'Beach House', 'Estate'],
  amenities: ['Ocean View', 'Private Pool', 'Beach Access', 'Golf Course', 'Spa', 'Gym', 'Concierge', 'Parking'],
  priceRange: {
    min: 100000,
    max: 5000000,
    step: 50000,
  },
  bedroomOptions: [1, 2, 3, 4, 5, 6],
  bathroomOptions: [1, 2, 3, 4, 5],
}

// Main PropertyFilter component
interface PropertyFilterProps {
  className?: string
  isOpen?: boolean
  onFilterChange?: (filters: FilterState) => void
  onClose?: () => void
  options?: Partial<FilterOptions>
  children: ReactNode
}

function PropertyFilterRoot({
  className,
  isOpen = false,
  onFilterChange,
  onClose,
  options = {},
  children,
}: PropertyFilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [options.priceRange?.min || 100000, options.priceRange?.max || 5000000],
    bedrooms: [],
    bathrooms: [],
    propertyType: [],
    location: [],
    amenities: [],
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [internalIsOpen, setInternalIsOpen] = useState(isOpen)

  const mergedOptions = { ...defaultOptions, ...options }

  const updateFilter = useCallback((key: keyof FilterState, value: number[] | [number, number] | string[]) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }, [filters, onFilterChange])

  const updateSearchQuery = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const clearFilters = useCallback(() => {
    const clearedFilters: FilterState = {
      priceRange: [mergedOptions.priceRange!.min, mergedOptions.priceRange!.max],
      bedrooms: [],
      bathrooms: [],
      propertyType: [],
      location: [],
      amenities: [],
    }
    setFilters(clearedFilters)
    setSearchQuery('')
    onFilterChange?.(clearedFilters)
  }, [mergedOptions.priceRange, onFilterChange])

  const toggleOpen = useCallback(() => {
    const newOpen = !internalIsOpen
    setInternalIsOpen(newOpen)
    if (!newOpen) {
      onClose?.()
    }
  }, [internalIsOpen, onClose])



  const setOpen = useCallback((open: boolean) => {
    setInternalIsOpen(open)
    if (!open) {
      onClose?.()
    }
  }, [onClose])

  const contextValue: PropertyFilterContextValue = {
    filters,
    searchQuery,
    isOpen: internalIsOpen,
    updateFilter,
    updateSearchQuery,
    clearFilters,
    toggleOpen,
    setOpen,
    onFilterChange,
    onClose,
    options: mergedOptions,
  }

  return (
    <PropertyFilterContext.Provider value={contextValue}>
      <div className={cn('property-filter', className)}>
        {children}
      </div>
    </PropertyFilterContext.Provider>
  )
}

// Sidebar container component
interface PropertyFilterSidebarProps {
  className?: string
  children: ReactNode
}

function PropertyFilterSidebar({ className, children }: PropertyFilterSidebarProps) {
  const { isOpen } = usePropertyFilterContext()

  return (
    <div
      className={cn(
        'fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:relative lg:translate-x-0 lg:block',
        className
      )}
    >
      <GlassCard className="h-full p-6 overflow-y-auto">
        {children}
      </GlassCard>
    </div>
  )
}

// Header component
interface PropertyFilterHeaderProps {
  className?: string
  title?: string
  showClearButton?: boolean
  showCloseButton?: boolean
}

function PropertyFilterHeader({
  className,
  title = 'Filters',
  showClearButton = true,
  showCloseButton = true,
}: PropertyFilterHeaderProps) {
  const { clearFilters, onClose } = usePropertyFilterContext()

  const handleClose = () => {
    // Always call onClose when close button is clicked
    onClose?.()
  }

  return (
    <div className={cn('flex items-center justify-between mb-6', className)}>
      <h2 className="heading-luxury text-xl text-foreground">{title}</h2>
      <div className="flex items-center space-x-2">
        {showClearButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-gold"
          >
            Clear All
          </Button>
        )}
        {showCloseButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="lg:hidden"
            aria-label="Close filters"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

// Search component
interface PropertyFilterSearchProps {
  className?: string
  placeholder?: string
  label?: string
}

function PropertyFilterSearch({
  className,
  placeholder = 'Search properties...',
  label = 'Search',
}: PropertyFilterSearchProps) {
  const { searchQuery, updateSearchQuery } = usePropertyFilterContext()

  return (
    <div className={cn('space-y-2', className)}>
      <Label className="text-foreground">{label}</Label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => updateSearchQuery(e.target.value)}
          className="pl-10 glass border-white/20"
        />
      </div>
    </div>
  )
}

// Price range component
interface PropertyFilterPriceRangeProps {
  className?: string
  label?: string
}

function PropertyFilterPriceRange({
  className,
  label = 'Price Range',
}: PropertyFilterPriceRangeProps) {
  const { filters, updateFilter, options } = usePropertyFilterContext()

  return (
    <div className={cn('space-y-3', className)}>
      <Label className="text-foreground">{label}</Label>
      <Slider
        value={filters.priceRange}
        onValueChange={(value) => updateFilter('priceRange', value)}
        max={options.priceRange!.max}
        min={options.priceRange!.min}
        step={options.priceRange!.step}
        className="accent-gold"
      />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>${filters.priceRange[0].toLocaleString()}</span>
        <span>${filters.priceRange[1].toLocaleString()}</span>
      </div>
    </div>
  )
}

// Checkbox group component
interface PropertyFilterCheckboxGroupProps {
  className?: string
  label: string
  filterKey: 'location' | 'propertyType' | 'amenities'
  options?: string[]
}

function PropertyFilterCheckboxGroup({
  className,
  label,
  filterKey,
  options,
}: PropertyFilterCheckboxGroupProps) {
  const { filters, updateFilter, options: contextOptions } = usePropertyFilterContext()
  // Map filterKey to the correct context option key
  const optionKeyMap: Record<string, keyof FilterOptions> = {
    location: 'locations',
    propertyType: 'propertyTypes',
    amenities: 'amenities',
  }

  const optionKey = optionKeyMap[filterKey] || filterKey
  const filterOptions = options || (contextOptions as Record<string, string[]>)[optionKey] || []

  const handleCheckboxChange = (value: string, checked: boolean) => {
    const currentValues = filters[filterKey] as string[]
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter((v) => v !== value)
    updateFilter(filterKey, newValues)
  }

  return (
    <div className={cn('space-y-3', className)}>
      <Label className="text-foreground">{label}</Label>
      <div className="space-y-2">
        {filterOptions.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox
              id={`${filterKey}-${option}`}
              checked={filters[filterKey].includes(option)}
              onCheckedChange={(checked) => handleCheckboxChange(option, checked as boolean)}
              className="accent-gold"
            />
            <Label
              htmlFor={`${filterKey}-${option}`}
              className="text-sm text-muted-foreground cursor-pointer"
            >
              {option}
            </Label>
          </div>
        ))}
      </div>
    </div>
  )
}

// Button group component
interface PropertyFilterButtonGroupProps {
  className?: string
  label: string
  filterKey: 'bedrooms' | 'bathrooms'
  options?: number[]
  suffix?: string
}

function PropertyFilterButtonGroup({
  className,
  label,
  filterKey,
  options,
  suffix = '+',
}: PropertyFilterButtonGroupProps) {
  const { filters, updateFilter, options: contextOptions } = usePropertyFilterContext()

  // Map filterKey to the correct context option key
  const optionKeyMap: Record<string, keyof FilterOptions> = {
    bedrooms: 'bedroomOptions',
    bathrooms: 'bathroomOptions',
  }

  const optionKey = optionKeyMap[filterKey] || filterKey
  const filterOptions = options || (contextOptions as Record<string, number[]>)[optionKey] || []

  const handleButtonClick = (value: number) => {
    const currentValues = filters[filterKey] as number[]
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value]
    updateFilter(filterKey, newValues)
  }

  return (
    <div className={cn('space-y-3', className)}>
      <Label className="text-foreground">{label}</Label>
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((num) => (
          <Button
            key={num}
            variant={filters[filterKey].includes(num) ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleButtonClick(num)}
            className={
              filters[filterKey].includes(num)
                ? 'bg-gold text-gold-foreground'
                : 'glass border-white/20 text-foreground hover:border-gold'
            }
          >
            {num}{suffix}
          </Button>
        ))}
      </div>
    </div>
  )
}

// Content wrapper component
interface PropertyFilterContentProps {
  className?: string
  children: ReactNode
}

function PropertyFilterContent({ className, children }: PropertyFilterContentProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {children}
    </div>
  )
}

// Toggle button component
interface PropertyFilterToggleProps {
  className?: string
  children: ReactNode
}

function PropertyFilterToggle({ className, children }: PropertyFilterToggleProps) {
  const { toggleOpen } = usePropertyFilterContext()

  return (
    <Button
      variant="outline"
      onClick={toggleOpen}
      className={cn('lg:hidden', className)}
    >
      {children}
    </Button>
  )
}

// Export compound components
export const PropertyFilter = Object.assign(PropertyFilterRoot, {
  Sidebar: PropertyFilterSidebar,
  Header: PropertyFilterHeader,
  Content: PropertyFilterContent,
  Search: PropertyFilterSearch,
  PriceRange: PropertyFilterPriceRange,
  CheckboxGroup: PropertyFilterCheckboxGroup,
  ButtonGroup: PropertyFilterButtonGroup,
  Toggle: PropertyFilterToggle,
})

// Export types
export type { PropertyFilterProps }
