"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GlassCard } from "./glass-card"
import { DatePicker } from "./date-picker"
import { PaymentSummary } from "./payment-summary"
import { ChevronLeft, ChevronRight, User, Calendar, CreditCard, CheckCircle } from "lucide-react"

interface ReservationFormProps {
  propertyId?: string
  propertyTitle?: string
}

interface FormData {
  // Step 1: Property Selection
  selectedProperty: string

  // Step 2: Date & Time
  tourDate: Date | undefined
  tourTime: string

  // Step 3: Guest Details
  firstName: string
  lastName: string
  email: string
  phone: string
  guests: number
  tourPackage: "basic" | "premium" | "luxury"
  specialRequests: string

  // Step 4: Payment
  cardNumber: string
  expiryDate: string
  cvv: string
  billingAddress: string
}

export function ReservationForm({ propertyTitle }: ReservationFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    selectedProperty: propertyTitle || "",
    tourDate: undefined,
    tourTime: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    guests: 2,
    tourPackage: "basic",
    specialRequests: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    billingAddress: "",
  })

  const steps = [
    { number: 1, title: "Property", icon: User },
    { number: 2, title: "Date & Time", icon: Calendar },
    { number: 3, title: "Details", icon: User },
    { number: 4, title: "Payment", icon: CreditCard },
    { number: 5, title: "Confirmation", icon: CheckCircle },
  ]

  // In a real app, this would fetch properties from the API
  const availableProperties = [
    "Oceanfront Villa Punta del Este",
    "Modern Penthouse La Barra", 
    "Beachfront Estate José Ignacio",
    "Contemporary Apartment Piriápolis",
    "Luxury Beach House Manantiales",
  ]

  const updateFormData = (field: keyof FormData, value: string | number | Date | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.selectedProperty !== ""
      case 2:
        return formData.tourDate && formData.tourTime !== ""
      case 3:
        return formData.firstName && formData.lastName && formData.email && formData.phone
      case 4:
        return formData.tourPackage === "basic" || (formData.cardNumber && formData.expiryDate && formData.cvv)
      default:
        return true
    }
  }

  const formatDate = (date: Date | undefined) => {
    if (!date) return ""
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <GlassCard className="p-6">
            <h2 className="heading-luxury text-2xl text-foreground mb-6">Select Property</h2>
            <div className="space-y-4">
              <Label className="text-foreground">Choose the property you&apos;d like to tour</Label>
              <Select
                value={formData.selectedProperty}
                onValueChange={(value) => updateFormData("selectedProperty", value)}
              >
                <SelectTrigger className="glass border-white/20">
                  <SelectValue placeholder="Select a property" />
                </SelectTrigger>
                <SelectContent className="glass border-white/20">
                  {availableProperties.map((property) => (
                    <SelectItem key={property} value={property}>
                      {property}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </GlassCard>
        )

      case 2:
        return (
          <div className="space-y-6">
            <GlassCard className="p-6">
              <h2 className="heading-luxury text-2xl text-foreground mb-6">Schedule Your Tour</h2>
              <p className="text-luxury text-muted-foreground mb-6">
                Select your preferred date and time for the property tour. Our luxury service operates Monday through
                Saturday.
              </p>
            </GlassCard>
            <DatePicker
              selectedDate={formData.tourDate}
              onDateSelect={(date) => updateFormData("tourDate", date)}
              selectedTime={formData.tourTime}
              onTimeSelect={(time) => updateFormData("tourTime", time)}
            />
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <GlassCard className="p-6">
              <h2 className="heading-luxury text-2xl text-foreground mb-6">Guest Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-foreground">First Name</Label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => updateFormData("firstName", e.target.value)}
                    className="glass border-white/20"
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Last Name</Label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => updateFormData("lastName", e.target.value)}
                    className="glass border-white/20"
                    placeholder="Enter your last name"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    className="glass border-white/20"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Phone</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                    className="glass border-white/20"
                    placeholder="+971 XX XXX XXXX"
                  />
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Number of Guests</Label>
                  <Select
                    value={formData.guests.toString()}
                    onValueChange={(value) => updateFormData("guests", Number.parseInt(value))}
                  >
                    <SelectTrigger className="glass border-white/20 w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/20">
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "person" : "people"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="heading-luxury text-xl text-foreground mb-4">Tour Package</h3>
              <div className="space-y-4">
                {[
                  {
                    id: "basic",
                    name: "Essential Tour",
                    price: "Complimentary",
                    description: "Property tour with expert consultation",
                  },
                  {
                    id: "premium",
                    name: "Premium Experience",
                    price: "$2,500",
                    description: "Includes flights, accommodation, and dining",
                  },
                  {
                    id: "luxury",
                    name: "Platinum Package",
                    price: "$5,000",
                    description: "First-class experience with exclusive services",
                  },
                ].map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.tourPackage === pkg.id
                        ? "border-gold bg-gold/10"
                        : "border-white/20 hover:border-white/40"
                    }`}
                    onClick={() => updateFormData("tourPackage", pkg.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="heading-luxury text-lg text-foreground">{pkg.name}</h4>
                        <p className="text-luxury text-sm text-muted-foreground">{pkg.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-luxury text-lg font-bold text-gold">{pkg.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-2">
                <Label className="text-foreground">Special Requests (Optional)</Label>
                <Textarea
                  value={formData.specialRequests}
                  onChange={(e) => updateFormData("specialRequests", e.target.value)}
                  className="glass border-white/20"
                  placeholder="Any special requirements or preferences..."
                  rows={3}
                />
              </div>
            </GlassCard>
          </div>
        )

      case 4:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              {formData.tourPackage !== "basic" && (
                <GlassCard className="p-6">
                  <h2 className="heading-luxury text-2xl text-foreground mb-6">Payment Details</h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-foreground">Card Number</Label>
                      <Input
                        value={formData.cardNumber}
                        onChange={(e) => updateFormData("cardNumber", e.target.value)}
                        className="glass border-white/20"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-foreground">Expiry Date</Label>
                        <Input
                          value={formData.expiryDate}
                          onChange={(e) => updateFormData("expiryDate", e.target.value)}
                          className="glass border-white/20"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-foreground">CVV</Label>
                        <Input
                          value={formData.cvv}
                          onChange={(e) => updateFormData("cvv", e.target.value)}
                          className="glass border-white/20"
                          placeholder="123"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">Billing Address</Label>
                      <Textarea
                        value={formData.billingAddress}
                        onChange={(e) => updateFormData("billingAddress", e.target.value)}
                        className="glass border-white/20"
                        placeholder="Enter your billing address"
                        rows={3}
                      />
                    </div>
                  </div>
                </GlassCard>
              )}

              {formData.tourPackage === "basic" && (
                <GlassCard className="p-6">
                  <h2 className="heading-luxury text-2xl text-foreground mb-4">Complimentary Tour</h2>
                  <p className="text-luxury text-muted-foreground">
                    Your essential tour is complimentary. No payment required at this time.
                  </p>
                </GlassCard>
              )}
            </div>

            <div>
              <PaymentSummary
                tourPackage={formData.tourPackage}
                propertyTitle={formData.selectedProperty}
                tourDate={formatDate(formData.tourDate)}
                tourTime={formData.tourTime}
                guests={formData.guests}
              />
            </div>
          </div>
        )

      case 5:
        return (
          <div className="text-center space-y-8">
            <GlassCard className="p-8">
              <div className="w-20 h-20 bg-gold rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-gold-foreground" />
              </div>
              <h2 className="heading-luxury text-3xl text-foreground mb-4">Reservation Confirmed!</h2>
              <p className="text-luxury text-lg text-muted-foreground mb-6">
                Thank you for booking your luxury property tour with Avent Properties.
              </p>

              <div className="space-y-4 text-left max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-luxury text-muted-foreground">Confirmation #</span>
                  <span className="text-luxury text-foreground font-mono">AP-{Date.now().toString().slice(-6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-luxury text-muted-foreground">Property</span>
                  <span className="text-luxury text-foreground">{formData.selectedProperty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-luxury text-muted-foreground">Date</span>
                  <span className="text-luxury text-foreground">{formatDate(formData.tourDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-luxury text-muted-foreground">Time</span>
                  <span className="text-luxury text-foreground">{formData.tourTime}</span>
                </div>
              </div>

              <div className="mt-8 p-4 glass rounded-lg">
                <p className="text-luxury text-sm text-muted-foreground">
                  A confirmation email has been sent to <strong>{formData.email}</strong>. Our Dubai office will contact
                  you within 24 hours to finalize arrangements.
                </p>
              </div>
            </GlassCard>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4 mb-4">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = currentStep === step.number
            const isCompleted = currentStep > step.number

            return (
              <div key={step.number} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                    isCompleted
                      ? "bg-gold border-gold text-gold-foreground"
                      : isActive
                        ? "border-gold text-gold"
                        : "border-white/20 text-muted-foreground"
                  }`}
                >
                  {isCompleted ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    isActive ? "text-gold" : isCompleted ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-4 ${isCompleted ? "bg-gold" : "bg-white/20"}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-8">{renderStep()}</div>

      {/* Navigation */}
      {currentStep < 5 && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="glass border-white/20 text-foreground hover:border-gold hover:text-gold bg-transparent"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <Button onClick={nextStep} disabled={!canProceed()} className="bg-gold text-gold-foreground hover:bg-gold/90">
            {currentStep === 4 ? "Complete Reservation" : "Next"}
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}
