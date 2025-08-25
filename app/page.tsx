import { MainLayout } from "@/components/main-layout"
import { SectionHeader } from "@/components/section-header"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/luxury-coastal-property-uruguay-beach-sunset.png"
            alt="Luxury coastal property in Uruguay"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <GlassCard className="p-8 md:p-12">
            <h1 className="heading-luxury text-4xl md:text-6xl lg:text-7xl text-foreground mb-6">
              Discover Luxury
              <span className="text-gold block">Coastal Living</span>
            </h1>
            <p className="text-luxury text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Premium properties in Uruguay's most exclusive coastal destinations. Connecting Dubai investors with
              extraordinary real estate opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90 text-lg px-8 py-4">
                Browse Properties
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="glass border-gold text-gold hover:bg-gold hover:text-gold-foreground text-lg px-8 py-4 bg-transparent"
              >
                Schedule Tour
              </Button>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Why Uruguay Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            title="Why Uruguay?"
            subtitle="Discover the perfect blend of European elegance and South American charm in one of the world's most stable investment markets."
            centered
            className="mb-16"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GlassCard className="p-8 text-center">
              <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-gold-foreground text-2xl font-bold">$</span>
              </div>
              <h3 className="heading-luxury text-xl text-foreground mb-4">Stable Investment</h3>
              <p className="text-luxury text-muted-foreground">
                Uruguay offers political stability, strong property rights, and a growing luxury real estate market.
              </p>
            </GlassCard>

            <GlassCard className="p-8 text-center">
              <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-gold-foreground text-2xl font-bold">🏖️</span>
              </div>
              <h3 className="heading-luxury text-xl text-foreground mb-4">Pristine Coastline</h3>
              <p className="text-luxury text-muted-foreground">
                200km of stunning Atlantic coastline with exclusive beaches and world-class amenities.
              </p>
            </GlassCard>

            <GlassCard className="p-8 text-center">
              <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-gold-foreground text-2xl font-bold">✈️</span>
              </div>
              <h3 className="heading-luxury text-xl text-foreground mb-4">Easy Access</h3>
              <p className="text-luxury text-muted-foreground">
                Direct flights from Dubai, favorable time zones, and no visa requirements for UAE residents.
              </p>
            </GlassCard>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
