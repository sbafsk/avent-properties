import { MainLayout } from "@/components/main-layout"
import { SectionHeader } from "@/components/section-header"
import { ContactForm } from "@/components/contact-form"
import { GlassCard } from "@/components/glass-card"
import { Clock, Calendar, MessageCircle } from "lucide-react"

export default function ContactPage() {
  return (
    <MainLayout>
      <div className="min-h-screen pt-24 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 mb-16">
          <div className="text-center max-w-4xl mx-auto">
            <SectionHeader
              title="Contact Avent Properties"
              subtitle="Get in touch with our luxury real estate experts"
            />
            <p className="text-luxury text-lg text-muted-foreground leading-relaxed mt-6">
              Whether you're looking to buy, sell, or invest in luxury properties, our team is here to help. Reach out
              to us and discover how we can make your real estate dreams a reality.
            </p>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="container mx-auto px-4 mb-16">
          <ContactForm />
        </section>

        {/* Additional Info */}
        <section className="container mx-auto px-4 mb-16">
          <div className="grid md:grid-cols-3 gap-6">
            <GlassCard className="p-6 text-center">
              <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-gold" />
              </div>
              <h3 className="heading-luxury text-lg text-foreground mb-2">Business Hours</h3>
              <div className="text-luxury text-sm text-muted-foreground space-y-1">
                <p>Monday - Friday: 9:00 AM - 7:00 PM</p>
                <p>Saturday: 10:00 AM - 5:00 PM</p>
                <p>Sunday: By Appointment</p>
              </div>
            </GlassCard>

            <GlassCard className="p-6 text-center">
              <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-gold" />
              </div>
              <h3 className="heading-luxury text-lg text-foreground mb-2">Schedule a Tour</h3>
              <p className="text-luxury text-sm text-muted-foreground mb-4">
                Book a personalized property tour with one of our experts
              </p>
              <button className="text-gold text-luxury text-sm hover:underline">Schedule Now</button>
            </GlassCard>

            <GlassCard className="p-6 text-center">
              <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-gold" />
              </div>
              <h3 className="heading-luxury text-lg text-foreground mb-2">Live Chat</h3>
              <p className="text-luxury text-sm text-muted-foreground mb-4">Get instant answers to your questions</p>
              <button className="text-gold text-luxury text-sm hover:underline">Start Chat</button>
            </GlassCard>
          </div>
        </section>

        {/* Map Section */}
        <section className="container mx-auto px-4">
          <SectionHeader title="Visit Our Office" subtitle="Located in the heart of Montevideo's business district" />
          <GlassCard className="p-8 mt-8">
            <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gold/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="heading-luxury text-xl text-foreground mb-2">Interactive Map</h3>
                <p className="text-luxury text-muted-foreground">
                  World Trade Center, Luis Alberto de Herrera 1248, Montevideo
                </p>
              </div>
            </div>
          </GlassCard>
        </section>
      </div>
    </MainLayout>
  )
}
