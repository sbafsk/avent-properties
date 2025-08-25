"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GlassCard } from "./glass-card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Eye, Upload, MapPin, Bed, Bath, Square } from "lucide-react"

interface Property {
  id: string
  title: string
  location: string
  price: number
  currency: string
  bedrooms: number
  bathrooms: number
  area: number
  type: string
  status: "active" | "pending" | "sold" | "draft"
  featured: boolean
  images: string[]
  description: string
  createdAt: string
  updatedAt: string
}

interface AgencyPropertyManagerProps {
  properties: Property[]
  onAdd: (property: Omit<Property, "id" | "createdAt" | "updatedAt">) => void
  onEdit: (id: string, property: Partial<Property>) => void
  onDelete: (id: string) => void
}

export function AgencyPropertyManager({ properties, onAdd, onDelete }: AgencyPropertyManagerProps) {
  const [isAddingProperty, setIsAddingProperty] = useState(false)
  const [newProperty, setNewProperty] = useState({
    title: "",
    location: "",
    price: 0,
    currency: "USD",
    bedrooms: 1,
    bathrooms: 1,
    area: 0,
    type: "Villa",
    status: "draft" as "active" | "pending" | "sold" | "draft",
    featured: false,
    images: [] as string[],
    description: "",
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "sold":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "draft":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const handleAddProperty = () => {
    onAdd(newProperty)
    setNewProperty({
      title: "",
      location: "",
      price: 0,
      currency: "USD",
      bedrooms: 1,
      bathrooms: 1,
      area: 0,
      type: "Villa",
      status: "draft",
      featured: false,
      images: [],
      description: "",
    })
    setIsAddingProperty(false)
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="heading-luxury text-2xl text-foreground">Property Management</h2>
          <p className="text-luxury text-muted-foreground">Manage your luxury property listings</p>
        </div>
        <Button onClick={() => setIsAddingProperty(true)} className="bg-gold text-gold-foreground hover:bg-gold/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </div>

      {/* Add Property Form */}
      {isAddingProperty && (
        <GlassCard className="p-6">
          <h3 className="heading-luxury text-xl text-foreground mb-6">Add New Property</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-foreground">Property Title</Label>
                <Input
                  value={newProperty.title}
                  onChange={(e) => setNewProperty({ ...newProperty, title: e.target.value })}
                  className="glass border-white/20"
                  placeholder="Luxury Oceanfront Villa..."
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Location</Label>
                <Select
                  value={newProperty.location}
                  onValueChange={(value) => setNewProperty({ ...newProperty, location: value })}
                >
                  <SelectTrigger className="glass border-white/20">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent className="glass border-white/20">
                    <SelectItem value="Punta del Este">Punta del Este</SelectItem>
                    <SelectItem value="José Ignacio">José Ignacio</SelectItem>
                    <SelectItem value="Piriápolis">Piriápolis</SelectItem>
                    <SelectItem value="La Barra">La Barra</SelectItem>
                    <SelectItem value="Manantiales">Manantiales</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Price</Label>
                  <Input
                    type="number"
                    value={newProperty.price}
                    onChange={(e) => setNewProperty({ ...newProperty, price: Number(e.target.value) })}
                    className="glass border-white/20"
                    placeholder="2500000"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Currency</Label>
                  <Select
                    value={newProperty.currency}
                    onValueChange={(value) => setNewProperty({ ...newProperty, currency: value })}
                  >
                    <SelectTrigger className="glass border-white/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/20">
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="UYU">UYU</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Bedrooms</Label>
                  <Input
                    type="number"
                    value={newProperty.bedrooms}
                    onChange={(e) => setNewProperty({ ...newProperty, bedrooms: Number(e.target.value) })}
                    className="glass border-white/20"
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Bathrooms</Label>
                  <Input
                    type="number"
                    value={newProperty.bathrooms}
                    onChange={(e) => setNewProperty({ ...newProperty, bathrooms: Number(e.target.value) })}
                    className="glass border-white/20"
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Area (m²)</Label>
                  <Input
                    type="number"
                    value={newProperty.area}
                    onChange={(e) => setNewProperty({ ...newProperty, area: Number(e.target.value) })}
                    className="glass border-white/20"
                    min="1"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-foreground">Property Type</Label>
                <Select
                  value={newProperty.type}
                  onValueChange={(value) => setNewProperty({ ...newProperty, type: value })}
                >
                  <SelectTrigger className="glass border-white/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass border-white/20">
                    <SelectItem value="Villa">Villa</SelectItem>
                    <SelectItem value="Apartment">Apartment</SelectItem>
                    <SelectItem value="Penthouse">Penthouse</SelectItem>
                    <SelectItem value="Beach House">Beach House</SelectItem>
                    <SelectItem value="Estate">Estate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Status</Label>
                <Select
                  value={newProperty.status}
                  onValueChange={(value: "active" | "pending" | "sold" | "draft") =>
                    setNewProperty({ ...newProperty, status: value })
                  }
                >
                  <SelectTrigger className="glass border-white/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass border-white/20">
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Description</Label>
                <Textarea
                  value={newProperty.description}
                  onChange={(e) => setNewProperty({ ...newProperty, description: e.target.value })}
                  className="glass border-white/20"
                  rows={4}
                  placeholder="Describe the property features and amenities..."
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Images</Label>
                <Button
                  variant="outline"
                  className="w-full glass border-white/20 text-foreground hover:border-gold hover:text-gold bg-transparent"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Images
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={newProperty.featured}
                  onChange={(e) => setNewProperty({ ...newProperty, featured: e.target.checked })}
                  className="accent-gold"
                />
                <Label htmlFor="featured" className="text-foreground">
                  Featured Property
                </Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsAddingProperty(false)}
              className="glass border-white/20 text-foreground hover:border-red-500 hover:text-red-400"
            >
              Cancel
            </Button>
            <Button onClick={handleAddProperty} className="bg-gold text-gold-foreground hover:bg-gold/90">
              Add Property
            </Button>
          </div>
        </GlassCard>
      )}

      {/* Properties List */}
      <div className="grid grid-cols-1 gap-6">
        {properties.map((property) => (
          <GlassCard key={property.id} className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="heading-luxury text-xl text-foreground mb-1">{property.title}</h3>
                    <div className="flex items-center text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-luxury text-sm">{property.location}</span>
                    </div>
                    <p className="text-luxury text-2xl font-bold text-gold">
                      {formatPrice(property.price, property.currency)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(property.status)}>
                      {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                    </Badge>
                    {property.featured && <Badge className="bg-gold text-gold-foreground">Featured</Badge>}
                    <Badge variant="outline" className="glass border-gold text-gold">
                      {property.type}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1" />
                    <span>{property.bedrooms}</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1" />
                    <span>{property.bathrooms}</span>
                  </div>
                  <div className="flex items-center">
                    <Square className="h-4 w-4 mr-1" />
                    <span>{property.area}m²</span>
                  </div>
                </div>

                <p className="text-luxury text-sm text-muted-foreground line-clamp-2">{property.description}</p>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Created: {new Date(property.createdAt).toLocaleDateString()}</span>
                  <span>Updated: {new Date(property.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex flex-col space-y-2 lg:w-48">
                <Button
                  variant="outline"
                  size="sm"
                  className="glass border-gold text-gold hover:bg-gold hover:text-gold-foreground bg-transparent"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => console.log("Edit property:", property.id)}
                  className="glass border-white/20 text-foreground hover:border-gold hover:text-gold"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(property.id)}
                  className="glass border-white/20 text-foreground hover:border-red-500 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {properties.length === 0 && (
        <GlassCard className="p-8 text-center">
          <Plus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="heading-luxury text-xl text-foreground mb-2">No Properties Yet</h3>
          <p className="text-luxury text-muted-foreground mb-6">Start by adding your first luxury property listing.</p>
          <Button onClick={() => setIsAddingProperty(true)} className="bg-gold text-gold-foreground hover:bg-gold/90">
            Add Your First Property
          </Button>
        </GlassCard>
      )}
    </div>
  )
}
