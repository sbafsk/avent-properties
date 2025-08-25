"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GlassCard } from "./glass-card"
import { LanguageToggle } from "./language-toggle"
import { LogOut, User, Settings } from "lucide-react"
import { useState } from "react"
import { signOut } from "@/lib/auth"
import { useRouter } from "next/navigation"

export function DashboardNavbar() {
  const [isSigningOut, setIsSigningOut] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      await signOut()
      router.push('/auth/signin')
    } catch (error) {
      console.error('Sign out error:', error)
      // Still redirect even if there's an error
      router.push('/auth/signin')
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-4">
      <GlassCard variant="nav" className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
              <span className="text-gold-foreground font-bold text-lg">A</span>
            </div>
            <span className="heading-luxury text-xl text-foreground">Avent Properties</span>
          </Link>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageToggle />
            
            {/* User Menu */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:text-gold"
                onClick={() => router.push('/dashboard/profile')}
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:text-gold"
                onClick={() => router.push('/dashboard/settings')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="glass border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 bg-transparent"
                onClick={handleSignOut}
                disabled={isSigningOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                {isSigningOut ? 'Signing Out...' : 'Sign Out'}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageToggle />
            <Button
              variant="ghost"
              size="sm"
              className="text-foreground"
              onClick={handleSignOut}
              disabled={isSigningOut}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </GlassCard>
    </nav>
  )
}
