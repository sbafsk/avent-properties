import { MainLayout } from "@/components/main-layout"
import { PropertyGallery } from "@/components/property-gallery"
import { PropertySpecs } from "@/components/property-specs"
import { PropertyCTA } from "@/components/property-cta"
import { GlassCard } from "@/components/glass-card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Share, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Mock property data - in a real app this would come from an API
const mockProperty = {
  id: "1",
  title: "Oceanfront Villa Punta del Este",
  location: "Punta del Este, Uruguay",
  price: 2500000,
  currency: "USD",
  bedrooms: 5,
  bathrooms: 4,
  area: 450,
  parking: 3,
  yearBuilt: 2021,
  lotSize: 800,
  type: "Villa",
  featured: true,
  description:
    "This exceptional oceanfront villa represents the pinnacle of luxury living in Punta del Este. Designed by renowned architects, this contemporary masterpiece offers unparalleled ocean views, premium finishes, and world-class amenities. The property features an open-concept design that seamlessly blends indoor and outdoor living, perfect for entertaining and relaxation. Located in one of Uruguay's most prestigious neighborhoods, this villa offers both privacy and proximity to the finest restaurants, golf courses, and cultural attractions.",
  images: [
    "/luxury-oceanfront-villa-exterior-punta-del-este.png",
    "/luxury-villa-living-room-ocean-view.png",
    "/modern-kitchen-luxury-villa-uruguay.png",
    "/master-bedroom-ocean-view-luxury-villa.png",
    "/infinity-pool-oceanfront-villa-uruguay.png",
    "/luxury-villa-terrace-ocean-view-sunset.png",
  ],
  amenities: ["Ocean View", "Private Pool", "Beach Access", "Gym", "Spa", "Concierge", "Security", "WiFi"],
  features: [
    "Smart Home Technology",
    "Wine Cellar",
    "Home Theater",
    "Chef's Kitchen",
    "Master Suite",
    "Guest Quarters",
    "Infinity Pool",
    "Private Beach",
    "Landscaped Gardens",
    "Outdoor Kitchen",
  ],
}

export default function PropertyDetailsPage({ params }: { params: { id: string } }) {
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
                      {mockProperty.featured && <Badge className="bg-gold text-gold-foreground">Featured</Badge>}
                      <Badge variant="outline" className="glass border-gold text-gold">
                        {mockProperty.type}
                      </Badge>
                    </div>
                    <h1 className="heading-luxury text-3xl md:text-4xl text-foreground">{mockProperty.title}</h1>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span className="text-luxury text-lg">{mockProperty.location}</span>
                    </div>
                  </div>

                  <Button variant="ghost" className="text-foreground hover:text-gold">
                    <Share className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Image Gallery */}
              <PropertyGallery images={mockProperty.images} title={mockProperty.title} />

              {/* Description */}
              <GlassCard className="p-6">
                <h2 className="heading-luxury text-2xl text-foreground mb-4">About This Property</h2>
                <p className="text-luxury text-muted-foreground leading-relaxed">{mockProperty.description}</p>
              </GlassCard>

              {/* Property Specs */}
              <PropertySpecs
                bedrooms={mockProperty.bedrooms}
                bathrooms={mockProperty.bathrooms}
                area={mockProperty.area}
                parking={mockProperty.parking}
                yearBuilt={mockProperty.yearBuilt}
                lotSize={mockProperty.lotSize}
                amenities={mockProperty.amenities}
                features={mockProperty.features}
              />

              {/* Location */}
              <GlassCard className="p-6">
                <h2 className="heading-luxury text-2xl text-foreground mb-4">Location</h2>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Interactive Map Coming Soon</p>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-luxury text-foreground">
                    Located in the heart of Punta del Este's most exclusive neighborhood
                  </p>
                  <p className="text-luxury text-muted-foreground text-sm">
                    Walking distance to premium restaurants, golf courses, and cultural attractions
                  </p>
                </div>
              </GlassCard>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <PropertyCTA price={mockProperty.price} currency={mockProperty.currency} propertyId={mockProperty.id} />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
