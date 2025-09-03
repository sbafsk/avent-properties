'use client'

import React, { useState } from 'react'
import { PropertyCard } from '@/components/property/property-card'
import { PropertyForm } from '@/components/property/property-form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

// Mock data for demonstration
const mockProperties = [
  {
    id: '1',
    title: 'Luxury Beach Villa',
    description: 'Beautiful villa with ocean view in the heart of Punta del Este',
    price: 1500000,
    currency: 'USD',
    location: 'Punta del Este',
    bedrooms: 4,
    bathrooms: 3,
    areaM2: 250,
    images: ['/placeholder-property.jpg', '/placeholder-property-2.jpg'],
    amenities: ['Pool', 'Garden', 'Ocean View', 'Garage', 'Security System']
  },
  {
    id: '2',
    title: 'Modern Apartment Complex',
    description: 'Contemporary apartment with city and sea views',
    price: 850000,
    currency: 'USD',
    location: 'José Ignacio',
    bedrooms: 3,
    bathrooms: 2,
    areaM2: 180,
    images: ['/placeholder-property.jpg'],
    amenities: ['Balcony', 'Parking', 'Gym', 'Pool']
  },
  {
    id: '3',
    title: 'Exclusive Penthouse',
    description: 'Luxurious penthouse with panoramic views of the coastline',
    price: 2200000,
    currency: 'USD',
    location: 'Punta del Este',
    bedrooms: 5,
    bathrooms: 4,
    areaM2: 320,
    images: ['/placeholder-property.jpg', '/placeholder-property-2.jpg', '/placeholder-property-3.jpg'],
    amenities: ['Private Pool', 'Helipad', 'Wine Cellar', 'Home Theater', 'Staff Quarters']
  }
]

export default function PropertiesPage() {
  const [properties, setProperties] = useState(mockProperties)
  const [selectedProperties, setSelectedProperties] = useState<string[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)

  const handlePropertySelect = (property: typeof mockProperties[0]) => {
    setSelectedProperties(prev =>
      prev.includes(property.id)
        ? prev.filter(id => id !== property.id)
        : [...prev, property.id]
    )
  }

  const handlePropertyBookmark = (property: typeof mockProperties[0]) => {
    console.log('Bookmarked:', property.title)
    // In a real app, this would call an API
  }

  const handlePropertyShare = (property: typeof mockProperties[0]) => {
    console.log('Sharing:', property.title)
    // In a real app, this would open a share dialog
  }

  const handleFormSubmit = (data: {
    title: string
    description: string
    price: number
    location: string
    propertyType: string
    bedrooms: number
    bathrooms: number
    areaM2: number
  }) => {
    const newProperty = {
      id: Date.now().toString(),
      ...data,
      currency: 'USD', // Add missing currency property
      images: ['/placeholder-property.jpg'],
      amenities: []
    }

    setProperties(prev => [newProperty, ...prev])
    setIsFormOpen(false)

    // In a real app, this would call an API
    console.log('New property created:', newProperty)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600 mt-2">
            Discover luxury properties in Uruguay&apos;s most exclusive coastal destinations
          </p>
        </div>

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="w-full md:w-auto">
              Add Property
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Property</DialogTitle>
            </DialogHeader>
            <PropertyForm onSubmit={handleFormSubmit} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-2xl font-bold text-primary">{properties.length}</div>
          <div className="text-sm text-gray-600">Total Properties</div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-2xl font-bold text-green-600">
            ${Math.round(properties.reduce((sum, p) => sum + p.price, 0) / 1000000)}M
          </div>
          <div className="text-sm text-gray-600">Total Value</div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-2xl font-bold text-blue-600">
            {properties.filter(p => p.location === 'Punta del Este').length}
          </div>
          <div className="text-sm text-gray-600">Punta del Este</div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-2xl font-bold text-purple-600">
            {properties.filter(p => p.location === 'José Ignacio').length}
          </div>
          <div className="text-sm text-gray-600">José Ignacio</div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {properties.map(property => (
          <PropertyCard
            key={property.id}
            property={property}
            variant={property.price > 1500000 ? 'featured' : 'default'}
            isSelected={selectedProperties.includes(property.id)}
            onSelect={handlePropertySelect}
            onBookmark={handlePropertyBookmark}
            onShare={handlePropertyShare}
          />
        ))}
      </div>

      {/* Selected Properties Summary */}
      {selectedProperties.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-white rounded-lg shadow-lg border p-4">
            <div className="flex items-center space-x-3">
              <div className="text-sm">
                <div className="font-medium">{selectedProperties.length} selected</div>
                <div className="text-gray-600">
                  ${Math.round(
                    properties
                      .filter(p => selectedProperties.includes(p.id))
                      .reduce((sum, p) => sum + p.price, 0) / 1000000
                  )}M total value
                </div>
              </div>
              <Button size="sm">
                View Selected
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {properties.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏠</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No properties yet</h3>
          <p className="text-gray-600 mb-6">
            Get started by adding your first property listing
          </p>
          <Button onClick={() => setIsFormOpen(true)}>
            Add Your First Property
          </Button>
        </div>
      )}
    </div>
  )
}
