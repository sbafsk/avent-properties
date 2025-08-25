"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GlassCard } from "./glass-card"
import { LanguageToggle } from "./language-toggle"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/listings", label: "Properties" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-4">
      <GlassCard variant="nav" className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
              <span className="text-gold-foreground font-bold text-lg">A</span>
            </div>
            <span className="heading-luxury text-xl text-foreground">Avent Properties</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-luxury text-foreground hover:text-gold transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA Buttons & Language Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageToggle />
            <Link href="/auth/signin">
              <Button
                variant="outline"
                className="glass border-gold text-gold hover:bg-gold hover:text-gold-foreground bg-transparent"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/tour-wizard">
              <Button className="bg-gold text-gold-foreground hover:bg-gold/90">Schedule Tour</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="sm" className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/10">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-luxury text-foreground hover:text-gold transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4">
                <LanguageToggle />
                <Link href="/auth/signin">
                  <Button
                    variant="outline"
                    className="glass border-gold text-gold hover:bg-gold hover:text-gold-foreground w-full bg-transparent"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/tour-wizard">
                  <Button className="bg-gold text-gold-foreground hover:bg-gold/90">Schedule Tour</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </GlassCard>
    </nav>
  )
}
