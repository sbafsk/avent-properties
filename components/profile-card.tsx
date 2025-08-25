"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GlassCard } from "./glass-card"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, MapPin, Edit, Save, X, Crown } from "lucide-react"
import { UserProfile } from "@/lib/types"

interface ProfileCardProps {
  profile: UserProfile
  onUpdate: (profile: UserProfile) => void
}

export function ProfileCard({ profile, onUpdate }: ProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState(profile)

  const handleSave = () => {
    onUpdate(editedProfile)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedProfile(profile)
    setIsEditing(false)
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "platinum":
        return "bg-gold text-gold-foreground"
      case "premium":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "standard":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const propertyTypeOptions = ["Villa", "Apartment", "Penthouse", "Beach House", "Estate"]
  const locationOptions = ["Punta del Este", "José Ignacio", "Piriápolis", "La Barra", "Manantiales"]

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-gold" />
          </div>
          <div>
            <h2 className="heading-luxury text-2xl text-foreground">
              {profile.firstName} {profile.lastName}
            </h2>
            <div className="flex items-center space-x-2 mt-1">
              <Badge className={getTierColor(profile.membershipTier)}>
                {profile.membershipTier === "platinum" && <Crown className="h-3 w-3 mr-1" />}
                {profile.membershipTier.charAt(0).toUpperCase() + profile.membershipTier.slice(1)} Member
              </Badge>
              <span className="text-luxury text-sm text-muted-foreground">
                Since {new Date(profile.joinDate).getFullYear()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="glass border-gold text-gold hover:bg-gold hover:text-gold-foreground"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="glass border-white/20 text-foreground hover:border-red-500 hover:text-red-400 bg-transparent"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} className="bg-gold text-gold-foreground hover:bg-gold/90">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Information */}
        <div className="space-y-6">
          <h3 className="heading-luxury text-lg text-foreground">Personal Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground">First Name</Label>
              {isEditing ? (
                <Input
                  value={editedProfile.firstName}
                  onChange={(e) => setEditedProfile({ ...editedProfile, firstName: e.target.value })}
                  className="glass border-white/20"
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gold" />
                  <span className="text-luxury text-foreground">{profile.firstName}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Last Name</Label>
              {isEditing ? (
                <Input
                  value={editedProfile.lastName}
                  onChange={(e) => setEditedProfile({ ...editedProfile, lastName: e.target.value })}
                  className="glass border-white/20"
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gold" />
                  <span className="text-luxury text-foreground">{profile.lastName}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Email</Label>
            {isEditing ? (
              <Input
                type="email"
                value={editedProfile.email}
                onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                className="glass border-white/20"
              />
            ) : (
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gold" />
                <span className="text-luxury text-foreground">{profile.email}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Phone</Label>
            {isEditing ? (
              <Input
                value={editedProfile.phone}
                onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                className="glass border-white/20"
              />
            ) : (
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gold" />
                <span className="text-luxury text-foreground">{profile.phone}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Location</Label>
            {isEditing ? (
              <Input
                value={editedProfile.location}
                onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                className="glass border-white/20"
              />
            ) : (
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gold" />
                <span className="text-luxury text-foreground">{profile.location}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Preferred Language</Label>
            {isEditing ? (
              <Select
                value={editedProfile.preferredLanguage}
                onValueChange={(value: "en" | "ar") => setEditedProfile({ ...editedProfile, preferredLanguage: value })}
              >
                <SelectTrigger className="glass border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass border-white/20">
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <span className="text-luxury text-foreground">
                {profile.preferredLanguage === "en" ? "English" : "العربية"}
              </span>
            )}
          </div>
        </div>

        {/* Investment Preferences */}
        <div className="space-y-6">
          <h3 className="heading-luxury text-lg text-foreground">Investment Preferences</h3>

          <div className="space-y-2">
            <Label className="text-foreground">Investment Budget</Label>
            {isEditing ? (
              <Select
                value={editedProfile.investmentBudget}
                onValueChange={(value) => setEditedProfile({ ...editedProfile, investmentBudget: value })}
              >
                <SelectTrigger className="glass border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass border-white/20">
                  <SelectItem value="500k-1m">$500K - $1M</SelectItem>
                  <SelectItem value="1m-2.5m">$1M - $2.5M</SelectItem>
                  <SelectItem value="2.5m-5m">$2.5M - $5M</SelectItem>
                  <SelectItem value="5m+">$5M+</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <span className="text-luxury text-foreground">{profile.investmentBudget}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Preferred Property Types</Label>
            {isEditing ? (
              <div className="space-y-2">
                {propertyTypeOptions.map((type) => (
                  <label key={type} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editedProfile.propertyTypes.includes(type)}
                      onChange={(e) => {
                        const newTypes = e.target.checked
                          ? [...editedProfile.propertyTypes, type]
                          : editedProfile.propertyTypes.filter((t) => t !== type)
                        setEditedProfile({ ...editedProfile, propertyTypes: newTypes })
                      }}
                      className="accent-gold"
                    />
                    <span className="text-luxury text-foreground text-sm">{type}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.propertyTypes.map((type) => (
                  <Badge key={type} variant="outline" className="glass border-gold text-gold">
                    {type}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Preferred Locations</Label>
            {isEditing ? (
              <div className="space-y-2">
                {locationOptions.map((location) => (
                  <label key={location} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editedProfile.locations.includes(location)}
                      onChange={(e) => {
                        const newLocations = e.target.checked
                          ? [...editedProfile.locations, location]
                          : editedProfile.locations.filter((l) => l !== location)
                        setEditedProfile({ ...editedProfile, locations: newLocations })
                      }}
                      className="accent-gold"
                    />
                    <span className="text-luxury text-foreground text-sm">{location}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.locations.map((location) => (
                  <Badge key={location} variant="outline" className="glass border-gold text-gold">
                    {location}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Investment Summary */}
          <div className="pt-4 border-t border-white/10">
            <div className="flex justify-between items-center">
              <span className="text-luxury text-muted-foreground">Total Investment</span>
              <span className="text-luxury text-xl font-bold text-gold">
                ${profile.totalInvestment.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
