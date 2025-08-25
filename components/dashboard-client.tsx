"use client"

import { useState } from "react"
import { GlassCard } from "@/components/glass-card"
import { ReservationList } from "@/components/reservation-list"
import { ProfileCard } from "@/components/profile-card"
import { AgencyPropertyManager } from "@/components/agency-property-manager"
import { AdminTransactionTable } from "@/components/admin-transaction-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Calendar, Building, BarChart3, Settings, Crown } from "lucide-react"
import { UserProfile, Property } from "@/lib/types"

// Local type definitions to match component expectations
interface DashboardReservation {
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

interface DashboardTransaction {
  id: string
  type: "tour_booking" | "property_purchase" | "commission" | "refund"
  amount: number
  currency: string
  status: "completed" | "pending" | "failed" | "refunded"
  clientName: string
  clientEmail: string
  propertyTitle: string
  agentName: string
  date: string
  description: string
}

interface DashboardClientProps {
  userProfile: UserProfile
  reservations: DashboardReservation[]
  properties: Property[]
  transactions: DashboardTransaction[]
  errors: {
    reservations: unknown
    properties: unknown
    transactions: unknown
  }
}

export function DashboardClient({ userProfile, reservations, properties, transactions }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [userRole] = useState<"client" | "agent" | "admin">("client") // This would come from auth context

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "reservations", label: "Reservations", icon: Calendar },
    { id: "profile", label: "Profile", icon: User },
    ...(userRole === "agent" || userRole === "admin"
      ? [{ id: "properties", label: "Properties", icon: Building }]
      : []),
    ...(userRole === "admin" ? [{ id: "transactions", label: "Transactions", icon: BarChart3 }] : []),
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    console.log("Profile updated:", updatedProfile)
  }

  const handlePropertyAdd = (property: Omit<Property, "id" | "createdAt" | "updatedAt">) => {
    console.log("Property added:", property)
  }

  const handlePropertyEdit = (id: string, property: Partial<Property>) => {
    console.log("Property edited:", id, property)
  }

  const handlePropertyDelete = (id: string) => {
    console.log("Property deleted:", id)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-8">
            {/* Welcome Section */}
            <GlassCard className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="heading-luxury text-3xl text-foreground mb-2">
                    Welcome back, {userProfile.firstName}!
                  </h1>
                  <p className="text-luxury text-lg text-muted-foreground">
                    Manage your luxury property investments and tours
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-gold text-gold-foreground">
                    <Crown className="h-3 w-3 mr-1" />
                    Platinum Member
                  </Badge>
                </div>
              </div>
            </GlassCard>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GlassCard className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-gold" />
                  </div>
                  <div>
                    <p className="text-luxury text-sm text-muted-foreground">Active Reservations</p>
                    <p className="text-luxury text-2xl font-bold text-foreground">
                      {reservations.filter((r: DashboardReservation) => r.status === "confirmed").length}
                    </p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Building className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-luxury text-sm text-muted-foreground">Properties Viewed</p>
                    <p className="text-luxury text-2xl font-bold text-foreground">12</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-luxury text-sm text-muted-foreground">Total Investment</p>
                    <p className="text-luxury text-2xl font-bold text-foreground">
                      ${userProfile.totalInvestment.toLocaleString()}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="heading-luxury text-2xl text-foreground mb-6">Recent Reservations</h2>
              <ReservationList reservations={reservations.slice(0, 2)} />
            </div>
          </div>
        )

      case "reservations":
        return (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="heading-luxury text-3xl text-foreground mb-2">My Reservations</h1>
                <p className="text-luxury text-muted-foreground">Track and manage your property tour bookings</p>
              </div>
              <Button className="bg-gold text-gold-foreground hover:bg-gold/90">Book New Tour</Button>
            </div>
            <ReservationList reservations={reservations} />
          </div>
        )

      case "profile":
        return (
          <div>
            <div className="mb-8">
              <h1 className="heading-luxury text-3xl text-foreground mb-2">My Profile</h1>
              <p className="text-luxury text-muted-foreground">Manage your account information and preferences</p>
            </div>
            <ProfileCard profile={userProfile} onUpdate={handleProfileUpdate} />
          </div>
        )

      case "properties":
        return (
          <div>
            <AgencyPropertyManager
              properties={properties}
              onAdd={handlePropertyAdd}
              onEdit={handlePropertyEdit}
              onDelete={handlePropertyDelete}
            />
          </div>
        )

      case "transactions":
        return (
          <div>
            <div className="mb-8">
              <h1 className="heading-luxury text-3xl text-foreground mb-2">Transaction Overview</h1>
              <p className="text-luxury text-muted-foreground">Monitor all financial transactions and revenue</p>
            </div>
            <AdminTransactionTable transactions={transactions} />
          </div>
        )

      case "settings":
        return (
          <GlassCard className="p-8">
            <h2 className="heading-luxury text-2xl text-foreground mb-6">Account Settings</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="heading-luxury text-lg text-foreground">Notifications</h3>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="accent-gold" />
                      <span className="text-luxury text-foreground">Email notifications</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="accent-gold" />
                      <span className="text-luxury text-foreground">SMS notifications</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="accent-gold" />
                      <span className="text-luxury text-foreground">Marketing updates</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="heading-luxury text-lg text-foreground">Privacy</h3>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="accent-gold" />
                      <span className="text-luxury text-foreground">Profile visibility</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="accent-gold" />
                      <span className="text-luxury text-foreground">Share investment data</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <Button className="bg-gold text-gold-foreground hover:bg-gold/90">Save Settings</Button>
              </div>
            </div>
          </GlassCard>
        )

      default:
        return null
    }
  }

  return (
    <div className="pt-24 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <GlassCard className="p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                        activeTab === tab.id
                          ? "bg-gold text-gold-foreground"
                          : "text-foreground hover:bg-white/5 hover:text-gold"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-luxury font-medium">{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </GlassCard>
          </div>

          {/* Main Content */}
          <div className="flex-1">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  )
}
