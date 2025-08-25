"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { GlassCard } from "./glass-card"
import { Search, X } from "lucide-react"

interface FilterState {
  priceRange: [number, number]
  bedrooms: number[]
  bathrooms: number[]
  propertyType: string[]
  location: string[]
  amenities: string[]
}

interface PropertyFilterSidebarProps {
  isOpen: boolean
  onClose: () => void
  onFilterChange: (filters: FilterState) => void
}

export function PropertyFilterSidebar({ isOpen, onClose, onFilterChange }: PropertyFilterSidebarProps) {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [100000, 5000000],
    bedrooms: [],
    bathrooms: [],
    propertyType: [],
    location: [],
    amenities: [],
  })

  const [searchQuery, setSearchQuery] = useState("")

  const locations = ["Punta del Este", "José Ignacio", "Piriápolis", "La Barra", "Manantiales"]

  const propertyTypes = ["Villa", "Apartment", "Penthouse", "Beach House", "Estate"]

  const amenities = ["Ocean View", "Private Pool", "Beach Access", "Golf Course", "Spa", "Gym", "Concierge", "Parking"]

  const handleFilterChange = (key: keyof FilterState, value: number[] | [number, number] | string[]) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleCheckboxChange = (key: keyof FilterState, value: string, checked: boolean) => {
    const currentValues = filters[key] as string[]
    const newValues = checked ? [...currentValues, value] : currentValues.filter((v) => v !== value)
    handleFilterChange(key, newValues)
  }

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      priceRange: [100000, 5000000],
      bedrooms: [],
      bathrooms: [],
      propertyType: [],
      location: [],
      amenities: [],
    }
    setFilters(clearedFilters)
    setSearchQuery("")
    onFilterChange(clearedFilters)
  }

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:relative lg:translate-x-0 lg:block`}
    >
      <GlassCard className="h-full p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="heading-luxury text-xl text-foreground">Filters</h2>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-gold">
              Clear All
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Search */}
          <div className="space-y-2">
            <Label className="text-foreground">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search properties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass border-white/20"
              />
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <Label className="text-foreground">Price Range</Label>
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => handleFilterChange("priceRange", value)}
              max={5000000}
              min={100000}
              step={50000}
              className="accent-gold"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>${filters.priceRange[0].toLocaleString()}</span>
              <span>${filters.priceRange[1].toLocaleString()}</span>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-3">
            <Label className="text-foreground">Location</Label>
            <div className="space-y-2">
              {locations.map((location) => (
                <div key={location} className="flex items-center space-x-2">
                  <Checkbox
                    id={location}
                    checked={filters.location.includes(location)}
                    onCheckedChange={(checked) => handleCheckboxChange("location", location, checked as boolean)}
                    className="accent-gold"
                  />
                  <Label htmlFor={location} className="text-sm text-muted-foreground cursor-pointer">
                    {location}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Property Type */}
          <div className="space-y-3">
            <Label className="text-foreground">Property Type</Label>
            <div className="space-y-2">
              {propertyTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={type}
                    checked={filters.propertyType.includes(type)}
                    onCheckedChange={(checked) => handleCheckboxChange("propertyType", type, checked as boolean)}
                    className="accent-gold"
                  />
                  <Label htmlFor={type} className="text-sm text-muted-foreground cursor-pointer">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Bedrooms */}
          <div className="space-y-3">
            <Label className="text-foreground">Bedrooms</Label>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <Button
                  key={num}
                  variant={filters.bedrooms.includes(num) ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    const newBedrooms = filters.bedrooms.includes(num)
                      ? filters.bedrooms.filter((b) => b !== num)
                      : [...filters.bedrooms, num]
                    handleFilterChange("bedrooms", newBedrooms)
                  }}
                  className={
                    filters.bedrooms.includes(num)
                      ? "bg-gold text-gold-foreground"
                      : "glass border-white/20 text-foreground hover:border-gold"
                  }
                >
                  {num}+
                </Button>
              ))}
            </div>
          </div>

          {/* Bathrooms */}
          <div className="space-y-3">
            <Label className="text-foreground">Bathrooms</Label>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <Button
                  key={num}
                  variant={filters.bathrooms.includes(num) ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    const newBathrooms = filters.bathrooms.includes(num)
                      ? filters.bathrooms.filter((b) => b !== num)
                      : [...filters.bathrooms, num]
                    handleFilterChange("bathrooms", newBathrooms)
                  }}
                  className={
                    filters.bathrooms.includes(num)
                      ? "bg-gold text-gold-foreground"
                      : "glass border-white/20 text-foreground hover:border-gold"
                  }
                >
                  {num}+
                </Button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-3">
            <Label className="text-foreground">Amenities</Label>
            <div className="space-y-2">
              {amenities.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity}
                    checked={filters.amenities.includes(amenity)}
                    onCheckedChange={(checked) => handleCheckboxChange("amenities", amenity, checked as boolean)}
                    className="accent-gold"
                  />
                  <Label htmlFor={amenity} className="text-sm text-muted-foreground cursor-pointer">
                    {amenity}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
