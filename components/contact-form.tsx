"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { GlassCard } from "./glass-card"
import { Mail, Phone, MapPin } from "lucide-react"

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Contact form submitted:", formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Contact Form */}
      <GlassCard className="p-8">
        <h3 className="heading-luxury text-2xl text-foreground mb-6">Send us a Message</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-luxury text-sm text-muted-foreground mb-2 block">Full Name *</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="glass border-white/20 bg-white/5 text-foreground"
                required
              />
            </div>
            <div>
              <label className="text-luxury text-sm text-muted-foreground mb-2 block">Email Address *</label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="glass border-white/20 bg-white/5 text-foreground"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-luxury text-sm text-muted-foreground mb-2 block">Phone Number</label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="glass border-white/20 bg-white/5 text-foreground"
              />
            </div>
            <div>
              <label className="text-luxury text-sm text-muted-foreground mb-2 block">Subject *</label>
              <Input
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="glass border-white/20 bg-white/5 text-foreground"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-luxury text-sm text-muted-foreground mb-2 block">Message *</label>
            <Textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              className="glass border-white/20 bg-white/5 text-foreground resize-none"
              required
            />
          </div>

          <Button type="submit" className="w-full bg-gold text-gold-foreground hover:bg-gold/90 text-luxury">
            Send Message
          </Button>
        </form>
      </GlassCard>

      {/* Contact Information */}
      <div className="space-y-6">
        <GlassCard className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-gold" />
            </div>
            <div>
              <h4 className="heading-luxury text-lg text-foreground mb-2">Montevideo Office</h4>
              <p className="text-luxury text-muted-foreground">
                World Trade Center
                <br />
                Luis Alberto de Herrera 1248
                <br />
                11300 Montevideo, Uruguay
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center">
              <Phone className="w-6 h-6 text-gold" />
            </div>
            <div>
              <h4 className="heading-luxury text-lg text-foreground mb-2">Phone</h4>
              <p className="text-luxury text-muted-foreground">
                +598 2628 1234
                <br />
                +598 99 123 456
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-gold" />
            </div>
            <div>
              <h4 className="heading-luxury text-lg text-foreground mb-2">Email</h4>
              <p className="text-luxury text-muted-foreground">
                info@aventproperties.uy
                <br />
                sales@aventproperties.uy
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
