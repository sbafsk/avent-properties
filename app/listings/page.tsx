"use client"

import { useState } from "react"
import { MainLayout } from "@/components/main-layout"
import { SectionHeader } from "@/components/section-header"
import { PropertyCard } from "@/components/property-card"
import { PropertyFilterSidebar } from "@/components/property-filter-sidebar"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Grid, List } from "lucide-react"

// Mock data for properties
const mockProperties = [
  {
    id: "1",
    title: "Oceanfront Villa Punta del Este",
    location: "Punta del Este",
    price: 2500000,
    currency: "USD",
    bedrooms: 5,
    bathrooms: 4,
    area: 450,
    imageUrl: "/luxury-oceanfront-villa-punta-del-este.png",
    featured: true,
    type: "Villa",
  },
  {
    id: "2",
    title: "Modern Penthouse La Barra",
    location: "La Barra",
    price: 1800000,
    currency: "USD",
    bedrooms: 3,
    bathrooms: 3,
    area: 280,
    imageUrl: "/modern-penthouse-la-barra-uruguay.png",
    featured: false,
    type: "Penthouse",
  },
  {
    id: "3",
    title: "Beachfront Estate José Ignacio",
    location: "José Ignacio",
    price: 4200000,
    currency: "USD",
    bedrooms: 6,
    bathrooms: 5,
    area: 650,
    imageUrl: "/beachfront-estate-jose-ignacio-uruguay.png",
    featured: true,
    type: "Estate",
  },
  {
    id: "4",
    title: "Contemporary Apartment Piriápolis",
    location: "Piriápolis",
    price: 850000,
    currency: "USD",
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    imageUrl: "/contemporary-apartment-piriopolis-uruguay.png",
    featured: false,
    type: "Apartment",
  },
  {
    id: "5",
    title: "Luxury Beach House Manantiales",
    location: "Manantiales",
    price: 3100000,
    currency: "USD",
    bedrooms: 4,
    bathrooms: 4,
    area: 380,
    imageUrl: "/luxury-beach-house-manantiales-uruguay.png",
    featured: false,
    type: "Beach House",
  },
  {
    id: "6",
    title: "Designer Villa Punta Ballena",
    location: "Punta del Este",
    price: 1950000,
    currency: "USD",
    bedrooms: 4,
    bathrooms: 3,
    area: 320,
    imageUrl: "/designer-villa-punta-ballena-uruguay.png",
    featured: false,
    type: "Villa",
  },
]

export default function ListingsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("price-desc")
  const [filteredProperties, setFilteredProperties] = useState(mockProperties)

  const handleFilterChange = (filters: any) => {
    // In a real app, this would filter the properties based on the filters
    // For now, we'll just keep all properties
    setFilteredProperties(mockProperties)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    const sorted = [...filteredProperties]

    switch (value) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price)
        break
      case "bedrooms-desc":
        sorted.sort((a, b) => b.bedrooms - a.bedrooms)
        break
      case "area-desc":
        sorted.sort((a, b) => b.area - a.area)
        break
      default:
        break
    }

    setFilteredProperties(sorted)
  }

  return (
    <MainLayout>
      <div className="pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="Luxury Properties"
            subtitle="Discover exceptional coastal properties in Uruguay's most prestigious locations"
            className="mb-12"
          />

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filter Sidebar */}
            <div className="lg:w-80 flex-shrink-0">
              <PropertyFilterSidebar
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onFilterChange={handleFilterChange}
              />
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsFilterOpen(true)}
                    className="lg:hidden glass border-white/20 text-foreground"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>

                  <p className="text-luxury text-muted-foreground">{filteredProperties.length} properties found</p>
                </div>

                <div className="flex items-center gap-4">
                  <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-48 glass border-white/20">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/20">
                      <SelectItem value="price-desc">Price: High to Low</SelectItem>
                      <SelectItem value="price-asc">Price: Low to High</SelectItem>
                      <SelectItem value="bedrooms-desc">Most Bedrooms</SelectItem>
                      <SelectItem value="area-desc">Largest Area</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center border border-white/20 rounded-lg p-1 glass">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className={viewMode === "grid" ? "bg-gold text-gold-foreground" : "text-foreground"}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className={viewMode === "list" ? "bg-gold text-gold-foreground" : "text-foreground"}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Properties Grid */}
              <div
                className={`grid gap-8 ${
                  viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
                }`}
              >
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} {...property} />
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-12">
                <Button
                  variant="outline"
                  className="glass border-gold text-gold hover:bg-gold hover:text-gold-foreground bg-transparent"
                >
                  Load More Properties
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
