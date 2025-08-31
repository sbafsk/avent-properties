/**
 * TourWizard Control Props Examples
 * 
 * This file demonstrates various ways to use the TourWizardControlProps component
 * with different levels of external control.
 */

import React, { useState } from 'react'
import { TourWizardControlProps, useTourWizardControlProps, TourWizardData } from './tour-wizard-control-props'

// Example 1: Completely Uncontrolled (Internal State)
export function UncontrolledTourWizard() {
  const handleSubmit = async (data: TourWizardData) => {
    console.log('Submitting tour request:', data)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  const handleCancel = () => {
    console.log('Tour wizard cancelled')
  }

  return (
    <TourWizardControlProps
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  )
}

// Example 2: Partially Controlled (Step Control Only)
export function StepControlledTourWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  
  const handleSubmit = async (data: TourWizardData) => {
    console.log('Submitting tour request:', data)
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  const handleStepChange = (step: number) => {
    setCurrentStep(step)
    console.log('Step changed to:', step)
  }

  return (
    <TourWizardControlProps
      currentStep={currentStep}
      onStepChange={handleStepChange}
      onSubmit={handleSubmit}
    />
  )
}

// Example 3: Fully Controlled (All State External)
export function FullyControlledTourWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<TourWizardData>({
    propertyType: '',
    location: '',
    tourDate: null,
    tourTime: '',
    tourType: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nationality: '',
    specialRequests: '',
    budget: '',
    timeline: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (data: TourWizardData) => {
    setIsSubmitting(true)
    setErrors({})
    
    try {
      console.log('Submitting tour request:', data)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setCurrentStep(6) // Success step
    } catch {
      setErrors({ submit: 'Failed to submit tour request' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDataChange = (newData: TourWizardData) => {
    setFormData(newData)
    // Clear errors when data changes
    setErrors({})
  }

  return (
    <TourWizardControlProps
      currentStep={currentStep}
      formData={formData}
      isSubmitting={isSubmitting}
      errors={errors}
      onStepChange={setCurrentStep}
      onDataChange={handleDataChange}
      onSubmittingChange={setIsSubmitting}
      onErrorsChange={setErrors}
      onSubmit={handleSubmit}
    />
  )
}

// Example 4: Using the Hook for Easier Management
export function HookBasedTourWizard() {
  const controlProps = useTourWizardControlProps({
    onSubmit: async (data: TourWizardData) => {
      console.log('Submitting tour request:', data)
      await new Promise(resolve => setTimeout(resolve, 1000))
    },
    onCancel: () => {
      console.log('Tour wizard cancelled')
    },
  })

  return <TourWizardControlProps {...controlProps} />
}

// Example 5: Multi-Wizard Synchronization
export function SynchronizedTourWizards() {
  const [sharedStep, setSharedStep] = useState(1)
  const [wizard1Data, setWizard1Data] = useState<TourWizardData>({
    propertyType: '',
    location: '',
    tourDate: null,
    tourTime: '',
    tourType: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nationality: '',
    specialRequests: '',
    budget: '',
    timeline: '',
  })
  const [wizard2Data, setWizard2Data] = useState<TourWizardData>({
    propertyType: '',
    location: '',
    tourDate: null,
    tourTime: '',
    tourType: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nationality: '',
    specialRequests: '',
    budget: '',
    timeline: '',
  })

  const handleSubmit1 = async (data: TourWizardData) => {
    console.log('Wizard 1 submitted:', data)
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  const handleSubmit2 = async (data: TourWizardData) => {
    console.log('Wizard 2 submitted:', data)
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Wizard 1</h3>
        <TourWizardControlProps
          currentStep={sharedStep}
          formData={wizard1Data}
          onStepChange={setSharedStep}
          onDataChange={setWizard1Data}
          onSubmit={handleSubmit1}
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Wizard 2</h3>
        <TourWizardControlProps
          currentStep={sharedStep}
          formData={wizard2Data}
          onStepChange={setSharedStep}
          onDataChange={setWizard2Data}
          onSubmit={handleSubmit2}
        />
      </div>
    </div>
  )
}

// Example 6: Custom Validation and Error Handling
export function CustomValidationTourWizard() {
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/
    return phoneRegex.test(phone) && phone.length >= 10
  }

  const handleDataChange = (data: TourWizardData) => {
    const newErrors: Record<string, string> = {}
    
    // Custom email validation
    if (data.email && !validateEmail(data.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    // Custom phone validation
    if (data.phone && !validatePhone(data.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }
    
    // Custom budget validation
    if (data.budget && !data.budget.includes('$')) {
      newErrors.budget = 'Please include currency symbol (e.g., $300,000)'
    }
    
    setErrors(newErrors)
  }

  const handleSubmit = async (data: TourWizardData) => {
    // Final validation before submit
    const finalErrors: Record<string, string> = {}
    
    if (!validateEmail(data.email)) {
      finalErrors.email = 'Valid email is required'
    }
    
    if (data.phone && !validatePhone(data.phone)) {
      finalErrors.phone = 'Valid phone number is required'
    }
    
    if (Object.keys(finalErrors).length > 0) {
      setErrors(finalErrors)
      return
    }
    
    console.log('Submitting with custom validation:', data)
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  const controlProps = useTourWizardControlProps({
    errors,
    onDataChange: handleDataChange,
    onErrorsChange: setErrors,
    onSubmit: handleSubmit,
  })

  return <TourWizardControlProps {...controlProps} />
}

// Example 7: Integration with External State Management (Redux/Zustand)
export function StateManagementTourWizard() {
  // This would typically use Redux, Zustand, or another state management library
  const [globalState, setGlobalState] = useState({
    currentStep: 1,
    formData: {
      propertyType: '',
      location: '',
      tourDate: null,
      tourTime: '',
      tourType: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      nationality: '',
      specialRequests: '',
      budget: '',
      timeline: '',
    } as TourWizardData,
    isSubmitting: false,
    errors: {} as Record<string, string>,
  })

  const handleSubmit = async (data: TourWizardData) => {
    setGlobalState(prev => ({ ...prev, isSubmitting: true }))
    
    try {
      // Save to global state
      setGlobalState(prev => ({ ...prev, formData: data }))
      
      console.log('Submitting to global state:', data)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setGlobalState(prev => ({ ...prev, currentStep: 6 }))
    } catch {
      setGlobalState(prev => ({ 
        ...prev, 
        errors: { submit: 'Failed to submit' } 
      }))
    } finally {
      setGlobalState(prev => ({ ...prev, isSubmitting: false }))
    }
  }

  return (
    <TourWizardControlProps
      currentStep={globalState.currentStep}
      formData={globalState.formData}
      isSubmitting={globalState.isSubmitting}
      errors={globalState.errors}
      onStepChange={(step) => setGlobalState(prev => ({ ...prev, currentStep: step }))}
      onDataChange={(data) => setGlobalState(prev => ({ ...prev, formData: data }))}
      onSubmittingChange={(submitting) => setGlobalState(prev => ({ ...prev, isSubmitting: submitting }))}
      onErrorsChange={(errors) => setGlobalState(prev => ({ ...prev, errors }))}
      onSubmit={handleSubmit}
    />
  )
}
