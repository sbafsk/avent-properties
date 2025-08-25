import { GlassCard } from "./glass-card"
import { Badge } from "@/components/ui/badge"
import { Bed, Bath, Square, Car, Waves, Trees, Dumbbell, Utensils, Wifi, Shield, MapPin, Calendar } from "lucide-react"

interface PropertySpecsProps {
  bedrooms: number
  bathrooms: number
  area: number
  parking: number
  yearBuilt: number
  lotSize?: number
  amenities: string[]
  features: string[]
}

export function PropertySpecs({
  bedrooms,
  bathrooms,
  area,
  parking,
  yearBuilt,
  lotSize,
  amenities,
  features,
}: PropertySpecsProps) {
  const getAmenityIcon = (amenity: string) => {
    const iconMap: { [key: string]: any } = {
      "Ocean View": Waves,
      "Private Pool": Waves,
      "Beach Access": Waves,
      "Golf Course": Trees,
      Spa: Trees,
      Gym: Dumbbell,
      Concierge: Shield,
      Parking: Car,
      Kitchen: Utensils,
      WiFi: Wifi,
      Security: Shield,
    }

    const IconComponent = iconMap[amenity] || MapPin
    return <IconComponent className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      {/* Basic Specs */}
      <GlassCard className="p-6">
        <h3 className="heading-luxury text-xl text-foreground mb-4">Property Details</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-gold/20 rounded-full mb-2 mx-auto">
              <Bed className="h-6 w-6 text-gold" />
            </div>
            <p className="text-2xl font-bold text-foreground">{bedrooms}</p>
            <p className="text-sm text-muted-foreground">Bedrooms</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-gold/20 rounded-full mb-2 mx-auto">
              <Bath className="h-6 w-6 text-gold" />
            </div>
            <p className="text-2xl font-bold text-foreground">{bathrooms}</p>
            <p className="text-sm text-muted-foreground">Bathrooms</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-gold/20 rounded-full mb-2 mx-auto">
              <Square className="h-6 w-6 text-gold" />
            </div>
            <p className="text-2xl font-bold text-foreground">{area}</p>
            <p className="text-sm text-muted-foreground">m² Interior</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-gold/20 rounded-full mb-2 mx-auto">
              <Car className="h-6 w-6 text-gold" />
            </div>
            <p className="text-2xl font-bold text-foreground">{parking}</p>
            <p className="text-sm text-muted-foreground">Parking</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gold" />
            <span className="text-muted-foreground">Built in {yearBuilt}</span>
          </div>
          {lotSize && (
            <div className="flex items-center space-x-2">
              <Square className="h-4 w-4 text-gold" />
              <span className="text-muted-foreground">Lot Size: {lotSize}m²</span>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Amenities */}
      <GlassCard className="p-6">
        <h3 className="heading-luxury text-xl text-foreground mb-4">Amenities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {amenities.map((amenity, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-gold/20 rounded-full">
                {getAmenityIcon(amenity)}
              </div>
              <span className="text-luxury text-foreground">{amenity}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Features */}
      <GlassCard className="p-6">
        <h3 className="heading-luxury text-xl text-foreground mb-4">Features</h3>
        <div className="flex flex-wrap gap-2">
          {features.map((feature, index) => (
            <Badge key={index} variant="outline" className="glass border-gold text-gold">
              {feature}
            </Badge>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
