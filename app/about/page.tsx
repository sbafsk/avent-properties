import { MainLayout } from "@/components/main-layout"
import { SectionHeader } from "@/components/section-header"
import { GlassCard } from "@/components/glass-card"
import { TeamMember } from "@/components/team-member"
import { Button } from "@/components/ui/button"
import { Award, Users, Globe, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const stats = [
    { icon: Award, label: "Years of Excellence", value: "15+" },
    { icon: Users, label: "Happy Clients", value: "500+" },
    { icon: Globe, label: "Properties Sold", value: "$50M+" },
    { icon: TrendingUp, label: "Market Growth", value: "25%" },
  ]

  const team = [
    {
      name: "Sofia Rodriguez",
      role: "Founder & CEO",
      bio: "With over 15 years in luxury real estate, Sofia founded Avent Properties to redefine the premium property experience in Uruguay.",
      image: "/professional-woman-ceo-luxury-real-estate.png",
    },
    {
      name: "Carlos Mendez",
      role: "Head of Sales",
      bio: "Carlos brings exceptional market knowledge and has facilitated over $20M in luxury property transactions across Uruguay's coast.",
      image: "/professional-man-sales-director-luxury-real-estate.png",
    },
    {
      name: "Isabella Torres",
      role: "Property Consultant",
      bio: "Isabella specializes in coastal properties and provides personalized service to international clients seeking their dream homes.",
      image: "/professional-woman-property-consultant-luxury-real.png",
    },
  ]

  return (
    <MainLayout>
      <div className="min-h-screen pt-24 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 mb-16">
          <div className="text-center max-w-4xl mx-auto">
            <SectionHeader
              title="About Avent Properties"
              subtitle="Redefining luxury real estate in Uruguay's most prestigious locations"
            />
            <p className="text-luxury text-lg text-muted-foreground leading-relaxed mt-6">
              Founded in 2009, Avent Properties has established itself as Uruguay's premier luxury real estate agency.
              We specialize in exclusive coastal properties, offering unparalleled service and expertise to discerning
              clients seeking exceptional homes in paradise.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 mb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <GlassCard key={index} className="p-6 text-center">
                <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-gold" />
                </div>
                <div className="heading-luxury text-3xl text-foreground mb-2">{stat.value}</div>
                <p className="text-luxury text-sm text-muted-foreground">{stat.label}</p>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Story Section */}
        <section className="container mx-auto px-4 mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="heading-luxury text-3xl text-foreground mb-6">Our Story</h2>
              <div className="space-y-4 text-luxury text-muted-foreground leading-relaxed">
                <p>
                  Avent Properties was born from a vision to transform how luxury real estate is experienced in Uruguay.
                  Our founder, Sofia Rodriguez, recognized the untapped potential of Uruguay's stunning coastline and
                  the growing demand for premium properties.
                </p>
                <p>
                  What started as a boutique agency has grown into the most trusted name in luxury real estate, known
                  for our personalized approach, market expertise, and commitment to excellence. We don't just sell
                  properties; we curate lifestyles and create lasting relationships.
                </p>
                <p>
                  Today, we continue to set new standards in the industry, combining traditional values with innovative
                  technology to deliver exceptional results for our clients.
                </p>
              </div>
            </div>
            <GlassCard className="p-8">
              <h3 className="heading-luxury text-2xl text-foreground mb-6">Our Mission</h3>
              <p className="text-luxury text-muted-foreground leading-relaxed mb-6">
                To provide unparalleled luxury real estate services that exceed expectations, connecting discerning
                clients with their perfect properties while maintaining the highest standards of integrity and
                professionalism.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gold rounded-full"></div>
                  <span className="text-luxury text-sm text-muted-foreground">Personalized Service</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gold rounded-full"></div>
                  <span className="text-luxury text-sm text-muted-foreground">Market Expertise</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gold rounded-full"></div>
                  <span className="text-luxury text-sm text-muted-foreground">Exclusive Properties</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Team Section */}
        <section className="container mx-auto px-4 mb-16">
          <SectionHeader title="Meet Our Team" subtitle="Experienced professionals dedicated to your success" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {team.map((member, index) => (
              <TeamMember key={index} {...member} />
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4">
          <GlassCard className="p-12 text-center">
            <h2 className="heading-luxury text-3xl text-foreground mb-4">Ready to Find Your Dream Property?</h2>
            <p className="text-luxury text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Let our experienced team guide you through Uruguay's most exclusive properties. Your perfect home awaits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/listings">
                <Button className="bg-gold text-gold-foreground hover:bg-gold/90">View Properties</Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="glass border-gold text-gold hover:bg-gold hover:text-gold-foreground bg-transparent"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </GlassCard>
        </section>
      </div>
    </MainLayout>
  )
}
