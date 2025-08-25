import Link from "next/link"
import { GlassCard } from "./glass-card"
import { Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="mt-20 p-4">
      <GlassCard className="px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
                <span className="text-gold-foreground font-bold text-lg">A</span>
              </div>
              <span className="heading-luxury text-xl text-foreground">Avent Properties</span>
            </div>
            <p className="text-luxury text-muted-foreground">
              Connecting Dubai investors with premium coastal properties in Uruguay.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="heading-luxury text-lg text-foreground">Quick Links</h3>
            <div className="flex flex-col space-y-2">
              <Link href="/listings" className="text-luxury text-muted-foreground hover:text-gold transition-colors">
                Properties
              </Link>
              <Link href="/about" className="text-luxury text-muted-foreground hover:text-gold transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="text-luxury text-muted-foreground hover:text-gold transition-colors">
                Contact
              </Link>
              <Link href="/dashboard" className="text-luxury text-muted-foreground hover:text-gold transition-colors">
                Dashboard
              </Link>
            </div>
          </div>

          {/* Locations */}
          <div className="space-y-4">
            <h3 className="heading-luxury text-lg text-foreground">Locations</h3>
            <div className="flex flex-col space-y-2">
              <span className="text-luxury text-muted-foreground">Punta del Este</span>
              <span className="text-luxury text-muted-foreground">José Ignacio</span>
              <span className="text-luxury text-muted-foreground">Piriápolis</span>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="heading-luxury text-lg text-foreground">Contact</h3>
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gold" />
                <span className="text-luxury text-muted-foreground text-sm">info@aventproperties.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gold" />
                <span className="text-luxury text-muted-foreground text-sm">+971 4 XXX XXXX</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gold" />
                <span className="text-luxury text-muted-foreground text-sm">Dubai, UAE</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center">
          <p className="text-luxury text-muted-foreground text-sm">© 2024 Avent Properties. All rights reserved.</p>
        </div>
      </GlassCard>
    </footer>
  )
}
