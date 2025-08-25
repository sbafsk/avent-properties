import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GlassCard } from "./glass-card"
import { Badge } from "@/components/ui/badge"
import { Bed, Bath, Square, MapPin } from "lucide-react"

interface PropertyCardProps {
  id: string
  title: string
  location: string
  price: number
  currency: string
  bedrooms: number
  bathrooms: number
  area: number
  imageUrl: string
  featured?: boolean
  type: string
}

export function PropertyCard({
  id,
  title,
  location,
  price,
  currency,
  bedrooms,
  bathrooms,
  area,
  imageUrl,
  featured = false,
  type,
}: PropertyCardProps) {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <GlassCard className="group overflow-hidden hover:scale-[1.02] transition-all duration-300">
      <div className="relative">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          width={400}
          height={300}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {featured && <Badge className="absolute top-4 left-4 bg-gold text-gold-foreground">Featured</Badge>}
        <Badge className="absolute top-4 right-4 glass text-foreground">{type}</Badge>
      </div>

      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="heading-luxury text-xl text-foreground group-hover:text-gold transition-colors">{title}</h3>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-luxury text-sm">{location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              <span>{bedrooms}</span>
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span>{bathrooms}</span>
            </div>
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1" />
              <span>{area}m²</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="space-y-1">
            <p className="text-luxury text-2xl font-bold text-gold">{formatPrice(price, currency)}</p>
          </div>
          <Link href={`/property/${id}`}>
            <Button className="bg-gold text-gold-foreground hover:bg-gold/90">View Details</Button>
          </Link>
        </div>
      </div>
    </GlassCard>
  )
}
