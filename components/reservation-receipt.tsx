import { GlassCard } from "./glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Mail, Calendar, MapPin, Users, Package } from "lucide-react"

interface ReservationReceiptProps {
  confirmationNumber: string
  propertyTitle: string
  tourDate: string
  tourTime: string
  guests: number
  tourPackage: "basic" | "premium" | "luxury"
  guestName: string
  guestEmail: string
  totalPaid: number
}

export function ReservationReceipt({
  confirmationNumber,
  propertyTitle,
  tourDate,
  tourTime,
  guests,
  tourPackage,
  guestName,
  guestEmail,
  totalPaid,
}: ReservationReceiptProps) {
  const packageNames = {
    basic: "Essential Tour",
    premium: "Premium Experience",
    luxury: "Platinum Package",
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <GlassCard className="p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
              <span className="text-gold-foreground font-bold text-lg">A</span>
            </div>
            <span className="heading-luxury text-2xl text-foreground">Avent Properties</span>
          </div>
          <h1 className="heading-luxury text-3xl text-foreground mb-2">Tour Confirmation</h1>
          <p className="text-luxury text-muted-foreground">Your luxury property tour has been confirmed</p>
        </div>

        {/* Confirmation Details */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="text-luxury text-sm text-muted-foreground">Tour Date & Time</p>
                  <p className="text-luxury text-foreground font-medium">{tourDate}</p>
                  <p className="text-luxury text-foreground font-medium">{tourTime}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="text-luxury text-sm text-muted-foreground">Property</p>
                  <p className="text-luxury text-foreground font-medium">{propertyTitle}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="text-luxury text-sm text-muted-foreground">Guests</p>
                  <p className="text-luxury text-foreground font-medium">
                    {guests} {guests === 1 ? "person" : "people"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
                  <Package className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="text-luxury text-sm text-muted-foreground">Package</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-luxury text-foreground font-medium">{packageNames[tourPackage]}</p>
                    <Badge className="bg-gold text-gold-foreground text-xs">
                      {tourPackage.charAt(0).toUpperCase() + tourPackage.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmation Number */}
          <div className="bg-gold/10 border border-gold/20 rounded-lg p-4 text-center">
            <p className="text-luxury text-sm text-muted-foreground mb-1">Confirmation Number</p>
            <p className="text-luxury text-2xl font-mono font-bold text-gold">{confirmationNumber}</p>
          </div>

          {/* Guest Information */}
          <div className="border-t border-white/10 pt-6">
            <h3 className="heading-luxury text-lg text-foreground mb-4">Guest Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-luxury text-sm text-muted-foreground">Name</p>
                <p className="text-luxury text-foreground font-medium">{guestName}</p>
              </div>
              <div>
                <p className="text-luxury text-sm text-muted-foreground">Email</p>
                <p className="text-luxury text-foreground font-medium">{guestEmail}</p>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          {totalPaid > 0 && (
            <div className="border-t border-white/10 pt-6">
              <h3 className="heading-luxury text-lg text-foreground mb-4">Payment Summary</h3>
              <div className="flex justify-between items-center">
                <span className="text-luxury text-muted-foreground">Deposit Paid</span>
                <span className="text-luxury text-xl font-bold text-gold">${totalPaid.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="border-t border-white/10 pt-6">
            <h3 className="heading-luxury text-lg text-foreground mb-4">What&apos;s Next?</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-gold-foreground text-xs font-bold">1</span>
                </div>
                <p className="text-luxury text-muted-foreground">
                  Our Dubai office will contact you within 24 hours to confirm arrangements
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-gold-foreground text-xs font-bold">2</span>
                </div>
                <p className="text-luxury text-muted-foreground">
                  {tourPackage !== "basic"
                    ? "Travel arrangements and accommodation details will be provided"
                    : "You'll receive the property address and meeting point details"}
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-gold-foreground text-xs font-bold">3</span>
                </div>
                <p className="text-luxury text-muted-foreground">
                  Enjoy your luxury property tour experience in Uruguay
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-white/10">
          <Button className="bg-gold text-gold-foreground hover:bg-gold/90 flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download Receipt
          </Button>
          <Button
            variant="outline"
            className="glass border-gold text-gold hover:bg-gold hover:text-gold-foreground flex-1 bg-transparent"
          >
            <Mail className="h-4 w-4 mr-2" />
            Email Receipt
          </Button>
        </div>
      </GlassCard>

      {/* Contact Information */}
      <GlassCard className="p-6 text-center">
        <h3 className="heading-luxury text-lg text-foreground mb-2">Need Assistance?</h3>
        <p className="text-luxury text-muted-foreground mb-4">
          Our Dubai office is available to help with any questions about your tour.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            className="glass border-white/20 text-foreground hover:border-gold hover:text-gold bg-transparent"
          >
            Call +971 4 XXX XXXX
          </Button>
          <Button
            variant="outline"
            className="glass border-white/20 text-foreground hover:border-gold hover:text-gold bg-transparent"
          >
            Email Support
          </Button>
        </div>
      </GlassCard>
    </div>
  )
}
