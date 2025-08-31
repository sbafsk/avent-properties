"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ListingsFilters } from "@/components/sections/listings-filters";
import { ListingsResults } from "@/components/sections/listings-results";
import { PropertyGridSkeleton } from "@/components/ui/property-grid-skeleton";
import { useProperties } from "@/hooks/use-properties";
import type { Property } from "@/hooks/use-properties";

interface FilterState {
  priceRange: [number, number]
  bedrooms: number[]
  bathrooms: number[]
  propertyType: string[]
  location: string[]
  amenities: string[]
}

interface ListingsWithFiltersProps {
  initialProperties?: Property[]
}

export function ListingsWithFilters({ initialProperties }: ListingsWithFiltersProps) {
  const router = useRouter();

  // Use advanced properties hook with state reducer pattern
  const {
    state: { properties, loading, error }
  } = useProperties({
    limit: 100
  });

  // Use initial properties if provided (server-side), otherwise use fetched properties
  const allProperties = useMemo(() => {
    return properties && properties.length > 0 ? properties : (initialProperties || []);
  }, [properties, initialProperties]);

  const [filteredProperties, setFilteredProperties] = useState<Property[]>(allProperties);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  // Update filtered properties when properties data changes
  useEffect(() => {
    if (allProperties && allProperties.length > 0) {
      setFilteredProperties(allProperties)
    }
  }, [allProperties])

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
        !filters.bedrooms.some(min => (property.bedrooms || 0) >= min)) {
        return false
      }

      // Bathrooms filter
      if (filters.bathrooms.length > 0 && property.bathrooms &&
        !filters.bathrooms.some(min => (property.bathrooms || 0) >= min)) {
        return false
      }

      // Amenities filter
      if (filters.amenities.length > 0 && property.amenities) {
        const hasRequiredAmenity = filters.amenities.some(amenity =>
          property.amenities!.includes(amenity)
        )
        if (!hasRequiredAmenity) {
          return false
        }
      }

      return true
    })
  }

  const handleFilterChange = (filters: FilterState) => {
    setIsFiltering(true);

    // Simulate filtering delay for better UX
    setTimeout(() => {
      const filtered = applyFilters(allProperties, filters);
      setFilteredProperties(filtered);
      setIsFiltering(false);
    }, 300);
  };

  const handleViewDetails = (id: string) => {
    router.push(`/property/${id}`);
  };

  // Only show loading if we don't have initial properties and are still loading
  if (loading && !initialProperties) {
    return (
      <div className="flex gap-8">
        <ListingsFilters
          isFilterOpen={isFilterOpen}
          onFilterOpen={() => setIsFilterOpen(true)}
          onFilterClose={() => setIsFilterOpen(false)}
          onFilterChange={handleFilterChange}
        />
        <div className="flex-1">
          <PropertyGridSkeleton count={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-8">
      <ListingsFilters
        isFilterOpen={isFilterOpen}
        onFilterOpen={() => setIsFilterOpen(true)}
        onFilterClose={() => setIsFilterOpen(false)}
        onFilterChange={handleFilterChange}
      />

      <ListingsResults
        properties={filteredProperties}
        allPropertiesCount={allProperties.length}
        loading={loading}
        filtering={isFiltering}
        error={error}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
}
