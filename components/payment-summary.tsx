import { GlassCard } from "./glass-card"
import { Badge } from "@/components/ui/badge"
import { Plane, Hotel, Car, Utensils, Camera, Shield } from "lucide-react"

interface PaymentSummaryProps {
  tourPackage: "basic" | "premium" | "luxury"
  propertyTitle: string
  tourDate: string
  tourTime: string
  guests: number
}

export function PaymentSummary({ tourPackage, propertyTitle, tourDate, tourTime, guests }: PaymentSummaryProps) {
  const packages = {
    basic: {
      name: "Essential Tour",
      price: 0,
      deposit: 0,
      features: ["Property tour with expert agent", "Market analysis report", "Investment consultation"],
    },
    premium: {
      name: "Premium Experience",
      price: 2500,
      deposit: 500,
      features: [
        "Private jet from Dubai",
        "Luxury hotel accommodation (2 nights)",
        "Premium car service",
        "Fine dining experiences",
        "Multiple property tours",
        "Legal consultation",
        "Investment portfolio review",
      ],
    },
    luxury: {
      name: "Platinum Package",
      price: 5000,
      deposit: 1000,
      features: [
        "First-class flights from Dubai",
        "5-star resort accommodation (3 nights)",
        "Private yacht experience",
        "Michelin-starred dining",
        "Exclusive property previews",
        "Personal investment advisor",
        "Legal & tax consultation",
        "Professional photography session",
        "Concierge services",
      ],
    },
  }

  const selectedPackage = packages[tourPackage]

  const getFeatureIcon = (feature: string) => {
    if (feature.includes("jet") || feature.includes("flight")) return <Plane className="h-4 w-4 text-gold" />
    if (feature.includes("hotel") || feature.includes("accommodation") || feature.includes("resort"))
      return <Hotel className="h-4 w-4 text-gold" />
    if (feature.includes("car") || feature.includes("yacht")) return <Car className="h-4 w-4 text-gold" />
    if (feature.includes("dining") || feature.includes("Michelin")) return <Utensils className="h-4 w-4 text-gold" />
    if (feature.includes("photography")) return <Camera className="h-4 w-4 text-gold" />
    if (feature.includes("Legal") || feature.includes("consultation")) return <Shield className="h-4 w-4 text-gold" />
    return <Shield className="h-4 w-4 text-gold" />
  }

  return (
    <div className="space-y-6">
      {/* Booking Summary */}
      <GlassCard className="p-6">
        <h3 className="heading-luxury text-xl text-foreground mb-4">Booking Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-luxury text-muted-foreground">Property</span>
            <span className="text-luxury text-foreground font-medium">{propertyTitle}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-luxury text-muted-foreground">Date</span>
            <span className="text-luxury text-foreground font-medium">{tourDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-luxury text-muted-foreground">Time</span>
            <span className="text-luxury text-foreground font-medium">{tourTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-luxury text-muted-foreground">Guests</span>
            <span className="text-luxury text-foreground font-medium">
              {guests} {guests === 1 ? "person" : "people"}
            </span>
          </div>
        </div>
      </GlassCard>

      {/* Package Details */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="heading-luxury text-xl text-foreground">{selectedPackage.name}</h3>
          <Badge className="bg-gold text-gold-foreground">
            {tourPackage.charAt(0).toUpperCase() + tourPackage.slice(1)}
          </Badge>
        </div>

        <div className="space-y-3 mb-6">
          {selectedPackage.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-3">
              {getFeatureIcon(feature)}
              <span className="text-luxury text-foreground">{feature}</span>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div className="border-t border-white/10 pt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-luxury text-muted-foreground">Package Price</span>
            <span className="text-luxury text-foreground">
              {selectedPackage.price === 0 ? "Complimentary" : `$${selectedPackage.price.toLocaleString()}`}
            </span>
          </div>
          {selectedPackage.deposit > 0 && (
            <>
              <div className="flex justify-between">
                <span className="text-luxury text-muted-foreground">Deposit Required</span>
                <span className="text-luxury text-gold font-medium">${selectedPackage.deposit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-luxury text-muted-foreground">Remaining Balance</span>
                <span className="text-luxury text-muted-foreground">
                  ${(selectedPackage.price - selectedPackage.deposit).toLocaleString()}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="border-t border-white/10 pt-4 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-luxury text-lg font-medium text-foreground">Total Due Today</span>
            <span className="text-luxury text-2xl font-bold text-gold">
              {selectedPackage.deposit === 0 ? "Free" : `$${selectedPackage.deposit.toLocaleString()}`}
            </span>
          </div>
        </div>
      </GlassCard>

      {/* Terms */}
      <GlassCard className="p-6">
        <h4 className="heading-luxury text-lg text-foreground mb-3">Terms & Conditions</h4>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• Tours are subject to property availability and weather conditions</p>
          <p>• Premium packages include full refund if property purchase is completed</p>
          <p>• 48-hour cancellation policy applies for premium packages</p>
          <p>• All travel arrangements coordinated by our Dubai office</p>
        </div>
      </GlassCard>
    </div>
  )
}
