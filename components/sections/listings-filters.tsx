import React from "react";
import { Button } from "@/components/ui/button";
import { PropertyFilterSidebar } from "@/components/property-filter-sidebar";
import { Filter } from "lucide-react";

interface FilterState {
  priceRange: [number, number];
  bedrooms: number[];
  bathrooms: number[];
  propertyType: string[];
  location: string[];
  amenities: string[];
}

interface ListingsFiltersProps {
  isFilterOpen: boolean;
  onFilterOpen: () => void;
  onFilterClose: () => void;
  onFilterChange: (filters: FilterState) => void;
  className?: string;
}

export function ListingsFilters({
  isFilterOpen,
  onFilterOpen,
  onFilterClose,
  onFilterChange,
  className,
}: ListingsFiltersProps) {
  return (
    <div className={className}>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-6">
        <Button
          onClick={onFilterOpen}
          variant="outline"
          className="glass border-white/20 text-foreground hover:border-gold"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Filter Sidebar */}
      <PropertyFilterSidebar
        isOpen={isFilterOpen}
        onClose={onFilterClose}
        onFilterChange={onFilterChange}
      />
    </div>
  );
}
