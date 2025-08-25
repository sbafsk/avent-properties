"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "./glass-card"
import { SectionHeader } from "./section-header"
import { InputField } from "./input-field"
import { DatePicker } from "./date-picker"
import { ChevronLeft, ChevronRight, Check, MapPin, Calendar, User, Settings, CheckCircle } from "lucide-react"

interface TourWizardData {
  propertyType: string
  location: string
  tourDate: Date | null
  tourTime: string
  tourType: string
  firstName: string
  lastName: string
  email: string
  phone: string
  nationality: string
  specialRequests: string
  budget: string
  timeline: string
}

const initialData: TourWizardData = {
  propertyType: "",
  location: "",
  tourDate: null,
  tourTime: "",
  tourType: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  nationality: "",
  specialRequests: "",
  budget: "",
  timeline: "",
}

export function TourWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<TourWizardData>(initialData)
  const totalSteps = 5

  const updateFormData = (field: keyof TourWizardData, value: string | Date | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    console.log("[v0] Tour booking submitted:", formData)
    // Here you would typically send the data to your backend
    alert("Tour booking submitted successfully! We'll contact you within 24 hours.")
  }

  const steps = [
    { number: 1, title: "Property", icon: MapPin },
    { number: 2, title: "Schedule", icon: Calendar },
    { number: 3, title: "Details", icon: User },
    { number: 4, title: "Preferences", icon: Settings },
    { number: 5, title: "Confirm", icon: CheckCircle },
  ]

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          title="Schedule Your Luxury Tour"
          subtitle="Let us create a personalized property viewing experience tailored to your preferences"
          centered
          className="mb-12"
        />

        {/* Progress Steps */}
        <GlassCard className="p-6 mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.number
              const isCompleted = currentStep > step.number

              return (
                <div key={step.number} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                      isCompleted
                        ? "bg-gold border-gold text-gold-foreground"
                        : isActive
                          ? "border-gold text-gold bg-gold/10"
                          : "border-muted text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p className={`text-sm font-medium ${isActive ? "text-gold" : "text-muted-foreground"}`}>
                      Step {step.number}
                    </p>
                    <p className={`text-xs ${isActive ? "text-foreground" : "text-muted-foreground"}`}>{step.title}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-4 ${isCompleted ? "bg-gold" : "bg-muted"}`} />
                  )}
                </div>
              )
            })}
          </div>
        </GlassCard>

        {/* Step Content */}
        <GlassCard className="p-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="heading-luxury text-2xl text-foreground mb-6">Property Preferences</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Property Type</label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => updateFormData("propertyType", e.target.value)}
                    className="w-full p-3 rounded-lg bg-background/50 border border-white/20 text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="">Select property type</option>
                    <option value="oceanfront-villa">Oceanfront Villa</option>
                    <option value="penthouse">Luxury Penthouse</option>
                    <option value="beachfront-estate">Beachfront Estate</option>
                    <option value="golf-course-home">Golf Course Home</option>
                    <option value="investment-property">Investment Property</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Preferred Location</label>
                  <select
                    value={formData.location}
                    onChange={(e) => updateFormData("location", e.target.value)}
                    className="w-full p-3 rounded-lg bg-background/50 border border-white/20 text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="">Select location</option>
                    <option value="punta-del-este">Punta del Este</option>
                    <option value="jose-ignacio">José Ignacio</option>
                    <option value="la-barra">La Barra</option>
                    <option value="montevideo">Montevideo</option>
                    <option value="colonia">Colonia del Sacramento</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Budget Range (USD)</label>
                <select
                  value={formData.budget}
                  onChange={(e) => updateFormData("budget", e.target.value)}
                  className="w-full p-3 rounded-lg bg-background/50 border border-white/20 text-foreground focus:border-gold focus:outline-none"
                >
                  <option value="">Select budget range</option>
                  <option value="500k-1m">$500K - $1M</option>
                  <option value="1m-2m">$1M - $2M</option>
                  <option value="2m-5m">$2M - $5M</option>
                  <option value="5m-10m">$5M - $10M</option>
                  <option value="10m+">$10M+</option>
                </select>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="heading-luxury text-2xl text-foreground mb-6">Schedule Your Tour</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Preferred Date</label>
                  <DatePicker date={formData.tourDate} onDateChange={(date) => updateFormData("tourDate", date)} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Preferred Time</label>
                  <select
                    value={formData.tourTime}
                    onChange={(e) => updateFormData("tourTime", e.target.value)}
                    className="w-full p-3 rounded-lg bg-background/50 border border-white/20 text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="">Select time</option>
                    <option value="morning">Morning (9:00 AM - 12:00 PM)</option>
                    <option value="afternoon">Afternoon (1:00 PM - 5:00 PM)</option>
                    <option value="evening">Evening (5:00 PM - 8:00 PM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Tour Type</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { value: "virtual", title: "Virtual Tour", desc: "Online property viewing" },
                    { value: "in-person", title: "In-Person Tour", desc: "Visit properties in Uruguay" },
                    { value: "vip-package", title: "VIP Package", desc: "Luxury tour with accommodation" },
                  ].map((option) => (
                    <div
                      key={option.value}
                      onClick={() => updateFormData("tourType", option.value)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.tourType === option.value
                          ? "border-gold bg-gold/10"
                          : "border-white/20 hover:border-gold/50"
                      }`}
                    >
                      <h4 className="font-medium text-foreground">{option.title}</h4>
                      <p className="text-sm text-muted-foreground">{option.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="heading-luxury text-2xl text-foreground mb-6">Personal Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => updateFormData("firstName", e.target.value)}
                  required
                />
                <InputField
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => updateFormData("lastName", e.target.value)}
                  required
                />
                <InputField
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  required
                />
                <InputField
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nationality</label>
                <select
                  value={formData.nationality}
                  onChange={(e) => updateFormData("nationality", e.target.value)}
                  className="w-full p-3 rounded-lg bg-background/50 border border-white/20 text-foreground focus:border-gold focus:outline-none"
                >
                  <option value="">Select nationality</option>
                  <option value="UAE">United Arab Emirates</option>
                  <option value="Saudi Arabia">Saudi Arabia</option>
                  <option value="Kuwait">Kuwait</option>
                  <option value="Qatar">Qatar</option>
                  <option value="Bahrain">Bahrain</option>
                  <option value="Oman">Oman</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="heading-luxury text-2xl text-foreground mb-6">Additional Preferences</h3>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Purchase Timeline</label>
                <select
                  value={formData.timeline}
                  onChange={(e) => updateFormData("timeline", e.target.value)}
                  className="w-full p-3 rounded-lg bg-background/50 border border-white/20 text-foreground focus:border-gold focus:outline-none"
                >
                  <option value="">Select timeline</option>
                  <option value="immediate">Immediate (Within 3 months)</option>
                  <option value="6months">Within 6 months</option>
                  <option value="1year">Within 1 year</option>
                  <option value="exploring">Just exploring</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Special Requests or Requirements
                </label>
                <textarea
                  value={formData.specialRequests}
                  onChange={(e) => updateFormData("specialRequests", e.target.value)}
                  rows={4}
                  className="w-full p-3 rounded-lg bg-background/50 border border-white/20 text-foreground focus:border-gold focus:outline-none resize-none"
                  placeholder="Any specific requirements, accessibility needs, or special requests for your tour..."
                />
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <h3 className="heading-luxury text-2xl text-foreground mb-6">Confirm Your Tour</h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-background/30">
                    <h4 className="font-medium text-gold mb-2">Property Preferences</h4>
                    <p className="text-sm text-muted-foreground">Type: {formData.propertyType || "Not specified"}</p>
                    <p className="text-sm text-muted-foreground">Location: {formData.location || "Not specified"}</p>
                    <p className="text-sm text-muted-foreground">Budget: {formData.budget || "Not specified"}</p>
                  </div>

                  <div className="p-4 rounded-lg bg-background/30">
                    <h4 className="font-medium text-gold mb-2">Tour Details</h4>
                    <p className="text-sm text-muted-foreground">
                      Date: {formData.tourDate?.toDateString() || "Not specified"}
                    </p>
                    <p className="text-sm text-muted-foreground">Time: {formData.tourTime || "Not specified"}</p>
                    <p className="text-sm text-muted-foreground">Type: {formData.tourType || "Not specified"}</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-background/30">
                  <h4 className="font-medium text-gold mb-2">Contact Information</h4>
                  <p className="text-sm text-muted-foreground">
                    {formData.firstName} {formData.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{formData.email}</p>
                  <p className="text-sm text-muted-foreground">{formData.phone}</p>
                </div>

                {formData.specialRequests && (
                  <div className="p-4 rounded-lg bg-background/30">
                    <h4 className="font-medium text-gold mb-2">Special Requests</h4>
                    <p className="text-sm text-muted-foreground">{formData.specialRequests}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="glass border-gold text-gold hover:bg-gold hover:text-gold-foreground bg-transparent"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button onClick={nextStep} className="bg-gold text-gold-foreground hover:bg-gold/90">
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-gold text-gold-foreground hover:bg-gold/90">
                <Check className="w-4 h-4 mr-2" />
                Submit Tour Request
              </Button>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
