"use client"

import React from "react"
import { PropertyFilter, type FilterState } from "./property-filter-compound"

interface PropertyFilterSidebarProps {
  isOpen: boolean
  onClose: () => void
  onFilterChange: (filters: FilterState) => void
}

/**
 * PropertyFilterSidebar Component - Now using Flexible Compound Components Pattern
 *
 * This component maintains backward compatibility while internally using
 * the new flexible compound components pattern for better flexibility and maintainability.
 *
 * @deprecated Consider using PropertyFilter compound components directly for more flexibility
 */
export function PropertyFilterSidebar({ isOpen, onClose, onFilterChange }: PropertyFilterSidebarProps) {
  return (
    <PropertyFilter
      isOpen={isOpen}
      onFilterChange={onFilterChange}
      onClose={onClose}
    >
      <PropertyFilter.Sidebar>
        <PropertyFilter.Header />
        <PropertyFilter.Content>
          <PropertyFilter.Search />
          <PropertyFilter.PriceRange />
          <PropertyFilter.CheckboxGroup
            label="Location"
            filterKey="location"
          />
          <PropertyFilter.CheckboxGroup
            label="Property Type"
            filterKey="propertyType"
          />
          <PropertyFilter.ButtonGroup
            label="Bedrooms"
            filterKey="bedrooms"
          />
          <PropertyFilter.ButtonGroup
            label="Bathrooms"
            filterKey="bathrooms"
          />
          <PropertyFilter.CheckboxGroup
            label="Amenities"
            filterKey="amenities"
          />
        </PropertyFilter.Content>
      </PropertyFilter.Sidebar>
    </PropertyFilter>
  )
}
