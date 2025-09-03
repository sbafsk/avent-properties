import React, { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bookmark, Heart, Share2, MapPin, Bed, Bath, Square } from 'lucide-react'

// Mock formatting function - replace with your actual implementation
const formatCurrency = (price: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD'
  }).format(price)
}

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
