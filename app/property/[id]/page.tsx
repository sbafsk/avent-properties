import { MainLayout } from "@/components/main-layout"
import { PropertyGallery } from "@/components/property-gallery"
import { PropertySpecs } from "@/components/property-specs"
import { PropertyCTA } from "@/components/property-cta"
import { GlassCard } from "@/components/glass-card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Share, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

// Fetch property from Supabase
async function getProperty(id: string) {
  const supabase = await createClient()
  
  const { data: property, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error || !property) {
    return null
  }
  
  return property
}

export default async function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const property = await getProperty(id)
  
  if (!property) {
    notFound()
  }
  return (
    <MainLayout>
      <div className="pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/listings">
              <Button variant="ghost" className="text-foreground hover:text-gold">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Properties
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Property Header */}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="glass border-gold text-gold">
                        {property.property_type}
                      </Badge>
                    </div>
                    <h1 className="heading-luxury text-3xl md:text-4xl text-foreground">{property.title}</h1>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span className="text-luxury text-lg">{property.city}, {property.neighborhood}</span>
                    </div>
                  </div>

                  <Button variant="ghost" className="text-foreground hover:text-gold">
                    <Share className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Image Gallery */}
              <PropertyGallery images={property.images || []} title={property.title} />

              {/* Description */}
              <GlassCard className="p-6">
                <h2 className="heading-luxury text-2xl text-foreground mb-4">About This Property</h2>
                <p className="text-luxury text-muted-foreground leading-relaxed">{property.description}</p>
              </GlassCard>

              {/* Property Specs */}
              <PropertySpecs
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                area={property.area_m2}
                parking={3}
                yearBuilt={2021}
                lotSize={800}
                amenities={property.amenities || []}
                features={property.amenities || []}
              />

              {/* Location */}
              <GlassCard className="p-6">
                <h2 className="heading-luxury text-2xl text-foreground mb-4">Location</h2>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Interactive Map Coming Soon</p>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-luxury text-foreground">
                    Located in the heart of Punta del Este&apos;s most exclusive neighborhood
                  </p>
                  <p className="text-luxury text-muted-foreground text-sm">
                    Walking distance to premium restaurants, golf courses, and cultural attractions
                  </p>
                </div>
              </GlassCard>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <PropertyCTA price={property.price} currency={property.currency} propertyId={property.id} />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
