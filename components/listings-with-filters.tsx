"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard } from '@/components/glass-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PropertyFilterSidebar } from '@/components/property-filter-sidebar'
import { PropertySkeleton } from '@/components/ui/property-skeleton'
import { SectionLoading } from '@/components/ui/page-loading'
import { MapPin, Filter } from 'lucide-react'
import { PropertyImage } from '@/components/ui/optimized-image'

interface Property {
  id: string
  title: string
  description: string
  price: number
  city: string
  neighborhood: string
  property_type: string
  bedrooms: number
  bathrooms: number
  area_m2: number
  images: string[]
  amenities: string[]
  status: string
  created_at: string
  updated_at: string
}

interface FilterState {
  priceRange: [number, number]
  bedrooms: number[]
  bathrooms: number[]
  propertyType: string[]
  location: string[]
  amenities: string[]
}

interface ListingsWithFiltersProps {
  initialProperties: Property[]
}

export function ListingsWithFilters({ initialProperties }: ListingsWithFiltersProps) {
  const [properties] = useState<Property[]>(initialProperties)
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(initialProperties)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isFiltering, setIsFiltering] = useState(false)

  // Simulate loading time for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  // Apply filters to properties
  const applyFilters = (properties: Property[], filters: FilterState) => {
    return properties.filter((property) => {

      // Price range filter
      if (property.price < filters.priceRange[0] || property.price > filters.priceRange[1]) {
        return false
      }

      // Location filter
      if (filters.location.length > 0 && !filters.location.includes(property.city)) {
        return false
      }

      // Property type filter
      if (filters.propertyType.length > 0 && !filters.propertyType.includes(property.property_type)) {
        return false
      }

      // Bedrooms filter
      if (filters.bedrooms.length > 0 && property.bedrooms && 
          !filters.bedrooms.some(min => property.bedrooms >= min)) {
        return false
      }

      // Bathrooms filter
      if (filters.bathrooms.length > 0 && property.bathrooms && 
          !filters.bathrooms.some(min => property.bathrooms >= min)) {
        return false
      }

      // Amenities filter
      if (filters.amenities.length > 0 && property.amenities) {
        const hasRequiredAmenity = filters.amenities.some(amenity => 
          property.amenities.includes(amenity)
        )
        if (!hasRequiredAmenity) {
          return false
        }
      }

      return true
    })
  }

  const handleFilterChange = (filters: FilterState) => {
    setIsFiltering(true)
    
    // Simulate filtering delay for better UX
    setTimeout(() => {
      const filtered = applyFilters(properties, filters)
      setFilteredProperties(filtered)
      setIsFiltering(false)
    }, 300)
  }

  // Search functionality is handled by the PropertyFilterSidebar component

  if (isLoading) {
    return (
      <div className="flex gap-8">
        <PropertyFilterSidebar
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onFilterChange={handleFilterChange}
        />
        <div className="flex-1">
          <PropertySkeleton count={6} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-8">
      {/* Filter Sidebar */}
      <PropertyFilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onFilterChange={handleFilterChange}
      />

      {/* Main Content */}
      <div className="flex-1">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <Button
            onClick={() => setIsFilterOpen(true)}
            variant="outline"
            className="glass border-white/20 text-foreground hover:border-gold"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-luxury text-muted-foreground">
            Showing {filteredProperties.length} of {properties.length} properties
          </p>
        </div>

        {/* Loading State for Filtering */}
        <AnimatePresence mode="wait">
          {isFiltering ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SectionLoading message="Applying filters..." />
            </motion.div>
          ) : (
            <motion.div
              key="properties"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Properties Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="wait">
                  {filteredProperties.map((property, index) => (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ 
                        duration: 0.3,
                        delay: index * 0.1
                      }}
                    >
                      <GlassCard className="overflow-hidden group hover:scale-105 transition-transform duration-300">
                        {/* Property Image */}
                        <div className="aspect-video bg-gradient-to-br from-gold/20 to-gold/5 relative overflow-hidden">
                          {property.images && property.images.length > 0 ? (
                            <PropertyImage 
                              src={property.images[0]} 
                              alt={property.title}
                              className="w-full h-full group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              <MapPin className="h-12 w-12 opacity-50" />
                            </div>
                          )}
                          
                          {/* Price Badge */}
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-gold text-gold-foreground font-semibold">
                              ${property.price.toLocaleString()}
                            </Badge>
                          </div>
                          
                          {/* Property Type Badge */}
                          <div className="absolute top-4 left-4">
                            <Badge variant="outline" className="glass border-white/20 text-foreground">
                              {property.property_type}
                            </Badge>
                          </div>
                        </div>
                        
                        {/* Property Details */}
                        <div className="p-6">
                          <h3 className="heading-luxury text-xl text-foreground mb-2 group-hover:text-gold transition-colors">
                            {property.title}
                          </h3>
                          
                          <div className="flex items-center text-muted-foreground mb-4">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span className="text-luxury">{property.city}, {property.neighborhood}</span>
                          </div>
                          
                          {/* Property Specs */}
                          <div className="flex items-center justify-between text-sm text-muted-foreground mb-6">
                            <div className="flex items-center space-x-4">
                              {property.bedrooms && (
                                <span className="flex items-center">
                                  <span className="font-semibold text-foreground">{property.bedrooms}</span>
                                  <span className="ml-1">beds</span>
                                </span>
                              )}
                              {property.bathrooms && (
                                <span className="flex items-center">
                                  <span className="font-semibold text-foreground">{property.bathrooms}</span>
                                  <span className="ml-1">baths</span>
                                </span>
                              )}
                              {property.area_m2 && (
                                <span className="flex items-center">
                                  <span className="font-semibold text-foreground">{property.area_m2}</span>
                                  <span className="ml-1">m²</span>
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* CTA Button */}
                          <Link 
                            href={`/property/${property.id}`}
                            className="w-full bg-gold text-gold-foreground py-3 px-6 rounded-lg hover:bg-gold/90 transition-colors text-center block font-semibold"
                          >
                            View Details
                          </Link>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Empty State */}
        {filteredProperties.length === 0 && !isFiltering && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center py-16"
          >
            <div className="max-w-md mx-auto">
              <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="heading-luxury text-xl text-foreground mb-2">No Properties Found</h3>
              <p className="text-luxury text-muted-foreground">
                Try adjusting your filters to see more properties.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
