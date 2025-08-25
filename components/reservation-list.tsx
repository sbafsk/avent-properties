import { GlassCard } from "./glass-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Clock, Phone } from "lucide-react"

interface Reservation {
  id: string
  confirmationNumber: string
  propertyTitle: string
  propertyLocation: string
  tourDate: string
  tourTime: string
  guests: number
  tourPackage: "basic" | "premium" | "luxury"
  status: "confirmed" | "pending" | "completed" | "cancelled"
  totalPaid: number
}

interface ReservationListProps {
  reservations: Reservation[]
}

export function ReservationList({ reservations }: ReservationListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "completed":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getPackageColor = (pkg: string) => {
    switch (pkg) {
      case "luxury":
        return "bg-gold text-gold-foreground"
      case "premium":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "basic":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  if (reservations.length === 0) {
    return (
      <GlassCard className="p-8 text-center">
        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="heading-luxury text-xl text-foreground mb-2">No Reservations Yet</h3>
        <p className="text-luxury text-muted-foreground mb-6">
          Start exploring our luxury properties and book your first tour.
        </p>
        <Button className="bg-gold text-gold-foreground hover:bg-gold/90">Browse Properties</Button>
      </GlassCard>
    )
  }

  return (
    <div className="space-y-6">
      {reservations.map((reservation) => (
        <GlassCard key={reservation.id} className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-4 flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="heading-luxury text-xl text-foreground mb-1">{reservation.propertyTitle}</h3>
                  <div className="flex items-center text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-luxury text-sm">{reservation.propertyLocation}</span>
                  </div>
                  <p className="text-luxury text-sm text-muted-foreground">
                    Confirmation: <span className="font-mono text-gold">{reservation.confirmationNumber}</span>
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(reservation.status)}>
                    {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                  </Badge>
                  <Badge className={getPackageColor(reservation.tourPackage)}>
                    {reservation.tourPackage.charAt(0).toUpperCase() + reservation.tourPackage.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gold" />
                  <span className="text-luxury text-sm text-foreground">{reservation.tourDate}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gold" />
                  <span className="text-luxury text-sm text-foreground">{reservation.tourTime}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gold" />
                  <span className="text-luxury text-sm text-foreground">
                    {reservation.guests} {reservation.guests === 1 ? "guest" : "guests"}
                  </span>
                </div>
              </div>

              {reservation.totalPaid > 0 && (
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-luxury text-sm text-muted-foreground">Amount Paid</span>
                  <span className="text-luxury text-lg font-bold text-gold">
                    ${reservation.totalPaid.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-2 lg:w-48">
              <Button
                variant="outline"
                size="sm"
                className="glass border-gold text-gold hover:bg-gold hover:text-gold-foreground bg-transparent"
              >
                View Details
              </Button>
              {reservation.status === "confirmed" && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="glass border-white/20 text-foreground hover:border-gold hover:text-gold bg-transparent"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="glass border-white/20 text-foreground hover:border-gold hover:text-gold bg-transparent"
                  >
                    Reschedule
                  </Button>
                </>
              )}
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  )
}
