"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "./glass-card"
import { SectionHeader } from "./section-header"
import { TourWizardControlProps } from "./tour-wizard-control-props"
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

  // Control Props pattern - external state control
  const handleWizardChange = (newData: TourWizardData) => {
    setFormData(newData)
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
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${isCompleted
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

        {/* Step Content - Using Control Props Pattern */}
        <TourWizardControlProps
          currentStep={currentStep}
          formData={formData}
          onDataChange={handleWizardChange}
          onStepChange={setCurrentStep}
        />

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
      </div>
    </div>
  )
}                                                                                                                                                                                                                           