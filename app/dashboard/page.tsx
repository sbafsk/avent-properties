"use client"

import { useState } from "react"
import { MainLayout } from "@/components/main-layout"
import { GlassCard } from "@/components/glass-card"
import { ReservationList } from "@/components/reservation-list"
import { ProfileCard } from "@/components/profile-card"
import { AgencyPropertyManager } from "@/components/agency-property-manager"
import { AdminTransactionTable } from "@/components/admin-transaction-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Calendar, Building, BarChart3, Settings, Crown } from "lucide-react"

// Mock data
const mockUserProfile = {
  id: "1",
  firstName: "Ahmed",
  lastName: "Al-Rashid",
  email: "ahmed.alrashid@example.com",
  phone: "+971 50 123 4567",
  location: "Dubai, UAE",
  preferredLanguage: "en" as const,
  investmentBudget: "$2.5M - $5M",
  propertyTypes: ["Villa", "Penthouse", "Estate"],
  locations: ["Punta del Este", "José Ignacio"],
  membershipTier: "platinum" as const,
  joinDate: "2023-01-15",
  totalInvestment: 3200000,
}

const mockReservations = [
  {
    id: "1",
    confirmationNumber: "AP-789123",
    propertyTitle: "Oceanfront Villa Punta del Este",
    propertyLocation: "Punta del Este, Uruguay",
    tourDate: "March 15, 2024",
    tourTime: "10:30 AM",
    guests: 2,
    tourPackage: "luxury" as const,
    status: "confirmed" as const,
    totalPaid: 1000,
  },
  {
    id: "2",
    confirmationNumber: "AP-456789",
    propertyTitle: "Modern Penthouse La Barra",
    propertyLocation: "La Barra, Uruguay",
    tourDate: "March 22, 2024",
    tourTime: "02:00 PM",
    guests: 4,
    tourPackage: "premium" as const,
    status: "pending" as const,
    totalPaid: 500,
  },
]

const mockProperties = [
  {
    id: "1",
    title: "Luxury Oceanfront Villa",
    location: "Punta del Este",
    price: 2500000,
    currency: "USD",
    bedrooms: 5,
    bathrooms: 4,
    area: 450,
    type: "Villa",
    status: "active" as const,
    featured: true,
    images: ["/placeholder.svg"],
    description: "Stunning oceanfront villa with panoramic views...",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-02-20T14:30:00Z",
  },
]

const mockTransactions = [
  {
    id: "txn_001",
    type: "property_purchase" as const,
    amount: 2500000,
    currency: "USD",
    status: "completed" as const,
    clientName: "Ahmed Al-Rashid",
    clientEmail: "ahmed.alrashid@example.com",
    propertyTitle: "Oceanfront Villa Punta del Este",
    agentName: "Maria Rodriguez",
    date: "2024-02-15T10:00:00Z",
    description: "Property purchase completion",
  },
  {
    id: "txn_002",
    type: "tour_booking" as const,
    amount: 1000,
    currency: "USD",
    status: "completed" as const,
    clientName: "Sarah Johnson",
    clientEmail: "sarah.johnson@example.com",
    propertyTitle: "Modern Penthouse La Barra",
    agentName: "Carlos Silva",
    date: "2024-02-10T15:30:00Z",
    description: "Luxury tour package booking",
  },
]

export default function DashboardPage() {
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

  const handleProfileUpdate = (updatedProfile: typeof mockUserProfile) => {
    console.log("Profile updated:", updatedProfile)
  }

  const handlePropertyAdd = (property: any) => {
    console.log("Property added:", property)
  }

  const handlePropertyEdit = (id: string, property: any) => {
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
                    Welcome back, {mockUserProfile.firstName}!
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
                      {mockReservations.filter((r) => r.status === "confirmed").length}
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
                      ${mockUserProfile.totalInvestment.toLocaleString()}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="heading-luxury text-2xl text-foreground mb-6">Recent Reservations</h2>
              <ReservationList reservations={mockReservations.slice(0, 2)} />
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
            <ReservationList reservations={mockReservations} />
          </div>
        )

      case "profile":
        return (
          <div>
            <div className="mb-8">
              <h1 className="heading-luxury text-3xl text-foreground mb-2">My Profile</h1>
              <p className="text-luxury text-muted-foreground">Manage your account information and preferences</p>
            </div>
            <ProfileCard profile={mockUserProfile} onUpdate={handleProfileUpdate} />
          </div>
        )

      case "properties":
        return (
          <div>
            <AgencyPropertyManager
              properties={mockProperties}
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
            <AdminTransactionTable transactions={mockTransactions} />
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
    <MainLayout>
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
    </MainLayout>
  )
}
