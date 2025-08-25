"use client"

import { useState } from 'react'
import { GlassCard } from '../glass-card'
import { Button } from './button'
import { Badge } from './badge'
import { Copy, Check, Crown, User, Building } from 'lucide-react'
import { motion } from 'framer-motion'

interface DemoUser {
  role: 'ADMIN' | 'CLIENT' | 'AGENCY'
  name: string
  email: string
  password: string
  description: string
  icon: React.ReactNode
  color: string
}

const demoUsers: DemoUser[] = [
  {
    role: 'ADMIN',
    name: 'Admin User',
    email: 'admin@aventproperties.com',
    password: 'admin123456',
    description: 'Full system access with all permissions',
    icon: <Crown className="h-5 w-5" />,
    color: 'from-red-500/20 to-red-600/20 border-red-500/30'
  },
  {
    role: 'CLIENT',
    name: 'John Smith',
    email: 'client@example.com',
    password: 'client123456',
    description: 'Property browsing and reservation access',
    icon: <User className="h-5 w-5" />,
    color: 'from-blue-500/20 to-blue-600/20 border-blue-500/30'
  },
  {
    role: 'AGENCY',
    name: 'Maria Rodriguez',
    email: 'agency@luxuryestates.uy',
    password: 'agency123456',
    description: 'Property management and client access',
    icon: <Building className="h-5 w-5" />,
    color: 'from-green-500/20 to-green-600/20 border-green-500/30'
  }
]

interface DemoCredentialsProps {
  onSelectCredentials: (email: string, password: string) => void
}

export function DemoCredentials({ onSelectCredentials }: DemoCredentialsProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-500/20 text-red-300 border-red-500/30'
      case 'CLIENT':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'AGENCY':
        return 'bg-green-500/20 text-green-300 border-green-500/30'
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="heading-luxury text-2xl text-foreground mb-2">
          Demo Credentials
        </h2>
        <p className="text-luxury text-muted-foreground">
          Use these test accounts to explore different user roles and features
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {demoUsers.map((user, index) => (
          <motion.div
            key={user.role}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <GlassCard className={`p-6 border ${user.color} hover:scale-105 transition-transform duration-300`}>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getRoleColor(user.role)}`}>
                    {user.icon}
                  </div>
                  <div>
                    <h3 className="heading-luxury text-lg text-foreground">{user.name}</h3>
                    <Badge className={getRoleColor(user.role)}>
                      {user.role}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-luxury text-sm text-muted-foreground mb-4">
                {user.description}
              </p>

              {/* Credentials */}
              <div className="space-y-3">
                {/* Email */}
                <div className="space-y-1">
                  <label className="text-luxury text-xs text-muted-foreground uppercase tracking-wide">
                    Email
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 p-2 bg-white/5 rounded border border-white/10 text-sm font-mono">
                      {user.email}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(user.email, `${user.role}-email`)}
                      className="px-2 py-1 h-8"
                    >
                      {copiedField === `${user.role}-email` ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="text-luxury text-xs text-muted-foreground uppercase tracking-wide">
                    Password
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 p-2 bg-white/5 rounded border border-white/10 text-sm font-mono">
                      {user.password}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(user.password, `${user.role}-password`)}
                      className="px-2 py-1 h-8"
                    >
                      {copiedField === `${user.role}-password` ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Quick Login Button */}
              <Button
                onClick={() => onSelectCredentials(user.email, user.password)}
                className="w-full mt-4 bg-gold text-gold-foreground hover:bg-gold/90"
              >
                Use This Account
              </Button>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Info Note */}
      <div className="mt-6 text-center">
        <p className="text-luxury text-xs text-muted-foreground">
          These are demo accounts for testing purposes. All data is reset periodically.
        </p>
      </div>
    </div>
  )
}
