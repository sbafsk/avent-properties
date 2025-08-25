import { Button } from "@/components/ui/button"
import { GlassCard } from "./glass-card"
import { Calendar, MessageCircle, Phone, Heart } from "lucide-react"

interface PropertyCTAProps {
  price: number
  currency: string
  propertyId: string
}

export function PropertyCTA({ price, currency, propertyId }: PropertyCTAProps) {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <GlassCard className="p-6 sticky top-24">
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-3xl font-bold text-gold mb-2">{formatPrice(price, currency)}</p>
          <p className="text-luxury text-muted-foreground">Exclusive luxury property</p>
        </div>

        <div className="space-y-3">
          <Button className="w-full bg-gold text-gold-foreground hover:bg-gold/90 text-lg py-6">
            <Calendar className="h-5 w-5 mr-2" />
            Reserve Tour
          </Button>

          <Button
            variant="outline"
            className="w-full glass border-gold text-gold hover:bg-gold hover:text-gold-foreground text-lg py-6 bg-transparent"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Contact Agent
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="glass border-white/20 text-foreground hover:border-gold hover:text-gold bg-transparent"
            >
              <Phone className="h-4 w-4 mr-2" />
              Call
            </Button>
            <Button
              variant="outline"
              className="glass border-white/20 text-foreground hover:border-gold hover:text-gold bg-transparent"
            >
              <Heart className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 text-center">
          <p className="text-luxury text-sm text-muted-foreground mb-2">Interested in this property?</p>
          <p className="text-luxury text-sm text-muted-foreground">
            Our Dubai office is ready to assist you with viewing arrangements and investment guidance.
          </p>
        </div>
      </div>
    </GlassCard>
  )
}
