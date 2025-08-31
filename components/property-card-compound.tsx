/**
 * PropertyCard Compound Components
 * 
 * Following Kent C. Dodds' Advanced React Patterns - Compound Components
 * This pattern allows for flexible composition of UI elements while sharing
 * state implicitly through React.Children.map and React.cloneElement.
 */

import React, { createContext, useContext, useCallback } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { GlassCard } from './glass-card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Bed, Bath, Square, Heart } from 'lucide-react'
import { cn, formatPrice, formatLocation } from '@/lib/utils'
import { useFavorites } from '@/hooks/use-favorites'

// Types
interface PropertyData {
  id: string
  title: string
  city: string
  neighborhood?: string
  price: number
  currency: string
  bedrooms?: number
  bathrooms?: number
  area_m2?: number
  imageUrl: string
  featured?: boolean
  property_type: string
}

interface PropertyCardContextValue {
  property: PropertyData
  isFavorite: boolean
  toggleFavorite: () => void
  onViewDetails?: (id: string) => void
}

// Context
const PropertyCardContext = createContext<PropertyCardContextValue | undefined>(undefined)

// Custom hook to use the context
function usePropertyCardContext() {
  const context = useContext(PropertyCardContext)
  if (context === undefined) {
    throw new Error('PropertyCard compound components must be used within PropertyCard')
  }
  return context
}

// Main PropertyCard component
interface PropertyCardProps {
  property: PropertyData
  className?: string
  onViewDetails?: (id: string) => void
  children: React.ReactNode
}

function PropertyCardRoot({
  property,
  className,
  onViewDetails,
  children
}: PropertyCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const isFav = isFavorite(property.id)

  const handleToggleFavorite = useCallback(() => {
    toggleFavorite(property.id)
  }, [toggleFavorite, property.id])

  const contextValue: PropertyCardContextValue = {
    property,
    isFavorite: isFav,
    toggleFavorite: handleToggleFavorite,
    onViewDetails,
  }

  return (
    <PropertyCardContext.Provider value={contextValue}>
      <GlassCard
        variant={property.featured ? 'luxury' : 'premium'}
        className={cn(
          'group hover:scale-105 transition-all duration-300',
          property.featured && 'ring-2 ring-gold/50',
          className
        )}
      >
        {children}
      </GlassCard>
    </PropertyCardContext.Provider>
  )
}

// Image component
interface PropertyCardImageProps {
  className?: string
}

function PropertyCardImage({ className }: PropertyCardImageProps) {
  const { property } = usePropertyCardContext()

  return (
    <div className={cn('relative aspect-video mb-4 rounded-lg overflow-hidden', className)}>
      <Image
        src={property.imageUrl || '/placeholder-property.jpg'}
        alt={property.title}
        width={400}
        height={300}
        className="object-cover group-hover:scale-110 transition-transform duration-300 w-full h-full"
      />
    </div>
  )
}

// Badges component
interface PropertyCardBadgesProps {
  className?: string
}

function PropertyCardBadges({ className }: PropertyCardBadgesProps) {
  const { property } = usePropertyCardContext()

  return (
    <div className={cn('absolute top-3 left-3 right-3 flex justify-between items-start', className)}>
      {/* Featured badge */}
      {property.featured && (
        <Badge
          variant="default"
          className="bg-gold text-gold-foreground"
        >
          Featured
        </Badge>
      )}

      {/* Property type badge */}
      <Badge
        variant="outline"
        className="glass border-gold text-gold"
      >
        {property.property_type}
      </Badge>
    </div>
  )
}

// Favorite button component
interface PropertyCardFavoriteProps {
  className?: string
}

function PropertyCardFavorite({ className }: PropertyCardFavoriteProps) {
  const { isFavorite, toggleFavorite } = usePropertyCardContext()

  return (
    <button
      onClick={toggleFavorite}
      className={cn(
        'absolute top-3 right-3 p-2 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-colors',
        className
      )}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        className={cn(
          'h-5 w-5',
          isFavorite ? 'fill-red-500 text-red-500' : 'text-white'
        )}
      />
    </button>
  )
}

// Header component (title and location)
interface PropertyCardHeaderProps {
  className?: string
}

function PropertyCardHeader({ className }: PropertyCardHeaderProps) {
  const { property } = usePropertyCardContext()

  return (
    <div className={cn('space-y-2', className)}>
      <h3 className="heading-luxury text-xl text-foreground mb-2 line-clamp-2">
        {property.title}
      </h3>
      <div className="flex items-center text-muted-foreground">
        <MapPin className="h-4 w-4 mr-1" />
        <span className="text-sm">
          {formatLocation(property.city, property.neighborhood)}
        </span>
      </div>
    </div>
  )
}

// Specifications component
interface PropertyCardSpecsProps {
  className?: string
}

function PropertyCardSpecs({ className }: PropertyCardSpecsProps) {
  const { property } = usePropertyCardContext()

  return (
    <div className={cn('flex items-center gap-4 text-sm text-muted-foreground', className)}>
      {property.bedrooms && (
        <div className="flex items-center gap-1">
          <Bed className="h-4 w-4" />
          <span>{property.bedrooms}</span>
        </div>
      )}
      {property.bathrooms && (
        <div className="flex items-center gap-1">
          <Bath className="h-4 w-4" />
          <span>{property.bathrooms}</span>
        </div>
      )}
      {property.area_m2 && (
        <div className="flex items-center gap-1">
          <Square className="h-4 w-4" />
          <span>{property.area_m2}m²</span>
        </div>
      )}
    </div>
  )
}

// Price component
interface PropertyCardPriceProps {
  className?: string
}

function PropertyCardPrice({ className }: PropertyCardPriceProps) {
  const { property } = usePropertyCardContext()

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div>
        <span className="text-2xl font-bold text-gold">
          {formatPrice(property.price, property.currency)}
        </span>
      </div>
    </div>
  )
}

// Actions component
interface PropertyCardActionsProps {
  className?: string
}

function PropertyCardActions({ className }: PropertyCardActionsProps) {
  const { property, onViewDetails } = usePropertyCardContext()

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(property.id)
    }
  }


  return (
    <div className={cn('flex gap-2', className)}>
      <Button
        variant="outline"
        size="sm"
        className="flex-1"
        onClick={handleViewDetails}
      >
        View Details
      </Button>
    </div>
  )
}

// Content wrapper component
interface PropertyCardContentProps {
  className?: string
  children: React.ReactNode
}

function PropertyCardContent({ className, children }: PropertyCardContentProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {children}
    </div>
  )
}

// Image container component (for overlays)
interface PropertyCardImageContainerProps {
  className?: string
  children: React.ReactNode
}

function PropertyCardImageContainer({ className, children }: PropertyCardImageContainerProps) {
  return (
    <div className={cn('relative', className)}>
      {children}
    </div>
  )
}

// Export compound components
export const PropertyCard = Object.assign(PropertyCardRoot, {
  Image: PropertyCardImage,
  ImageContainer: PropertyCardImageContainer,
  Badges: PropertyCardBadges,
  Favorite: PropertyCardFavorite,
  Content: PropertyCardContent,
  Header: PropertyCardHeader,
  Specs: PropertyCardSpecs,
  Price: PropertyCardPrice,
  Actions: PropertyCardActions,
})

// Export types
export type { PropertyData, PropertyCardProps }
