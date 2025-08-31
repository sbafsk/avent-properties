"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "./glass-card"
import { SectionHeader } from "./section-header"
import { InputField } from "./input-field"
import { DatePicker } from "./date-picker"
import { ChevronLeft, ChevronRight, Check, MapPin, Calendar, User, Settings, CheckCircle } from "lucide-react"

// Types
export interface TourWizardData {
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

export interface TourWizardState {
    currentStep: number
    formData: TourWizardData
    isSubmitting: boolean
    errors: Record<string, string>
}

export interface TourWizardControlProps {
    // Controlled props
    currentStep?: number
    formData?: TourWizardData
    isSubmitting?: boolean
    errors?: Record<string, string>

    // Change handlers
    onStepChange?: (step: number) => void
    onDataChange?: (data: TourWizardData) => void
    onSubmittingChange?: (isSubmitting: boolean) => void
    onErrorsChange?: (errors: Record<string, string>) => void

    // Other props
    totalSteps?: number
    onSubmit?: (data: TourWizardData) => void | Promise<void>
    onCancel?: () => void
    className?: string
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

const initialState: TourWizardState = {
    currentStep: 1,
    formData: initialData,
    isSubmitting: false,
    errors: {},
}

export function TourWizardControlProps({
    currentStep: controlledCurrentStep,
    formData: controlledFormData,
    isSubmitting: controlledIsSubmitting,
    errors: controlledErrors,
    onStepChange,
    onDataChange,
    onSubmittingChange,
    onErrorsChange,
    totalSteps = 5,
    onSubmit,
    onCancel,
    className,
}: TourWizardControlProps) {
    // Internal state (fallback when not controlled)
    const [internalState, setInternalState] = useState<TourWizardState>(initialState)

    // Determine if props are controlled
    const isStepControlled = controlledCurrentStep !== undefined
    const isDataControlled = controlledFormData !== undefined
    const isSubmittingControlled = controlledIsSubmitting !== undefined
    const isErrorsControlled = controlledErrors !== undefined

    // Use controlled values or fall back to internal state
    const currentStep = isStepControlled ? controlledCurrentStep : internalState.currentStep
    const formData = isDataControlled ? controlledFormData : internalState.formData
    const isSubmitting = isSubmittingControlled ? controlledIsSubmitting : internalState.isSubmitting
    const errors = isErrorsControlled ? controlledErrors : internalState.errors

    // Update internal state when not controlled
    const updateInternalState = useCallback((updates: Partial<TourWizardState>) => {
        if (!isStepControlled || !isDataControlled || !isSubmittingControlled || !isErrorsControlled) {
            setInternalState(prev => ({ ...prev, ...updates }))
        }
    }, [isStepControlled, isDataControlled, isSubmittingControlled, isErrorsControlled])

    // Update form data
    const updateFormData = useCallback((field: keyof TourWizardData, value: string | Date | null) => {
        const newData = { ...formData, [field]: value }

        if (isDataControlled) {
            onDataChange?.(newData)
        } else {
            updateInternalState({ formData: newData })
        }
    }, [formData, isDataControlled, onDataChange, updateInternalState])

    // Update current step
    const updateCurrentStep = useCallback((step: number) => {
        if (isStepControlled) {
            onStepChange?.(step)
        } else {
            updateInternalState({ currentStep: step })
        }
    }, [isStepControlled, onStepChange, updateInternalState])

    // Update submitting state
    const updateSubmitting = useCallback((submitting: boolean) => {
        if (isSubmittingControlled) {
            onSubmittingChange?.(submitting)
        } else {
            updateInternalState({ isSubmitting: submitting })
        }
    }, [isSubmittingControlled, onSubmittingChange, updateInternalState])

    // Update errors
    const updateErrors = useCallback((newErrors: Record<string, string>) => {
        if (isErrorsControlled) {
            onErrorsChange?.(newErrors)
        } else {
            updateInternalState({ errors: newErrors })
        }
    }, [isErrorsControlled, onErrorsChange, updateInternalState])

    // Navigation functions
    const nextStep = useCallback(() => {
        if (currentStep < totalSteps) {
            updateCurrentStep(currentStep + 1)
        }
    }, [currentStep, totalSteps, updateCurrentStep])

    const prevStep = useCallback(() => {
        if (currentStep > 1) {
            updateCurrentStep(currentStep - 1)
        }
    }, [currentStep, updateCurrentStep])

    // Form submission
    const handleSubmit = useCallback(async () => {
        updateSubmitting(true)
        updateErrors({})

        try {
            await onSubmit?.(formData)
            updateCurrentStep(totalSteps + 1) // Move to success step
        } catch (error) {
            updateErrors({
                submit: error instanceof Error ? error.message : 'An error occurred'
            })
        } finally {
            updateSubmitting(false)
        }
    }, [formData, onSubmit, totalSteps, updateSubmitting, updateErrors, updateCurrentStep])

    // Validation
    const validateStep = useCallback((step: number): boolean => {
        const newErrors: Record<string, string> = {}

        switch (step) {
            case 1:
                if (!formData.propertyType) newErrors.propertyType = "Property type is required"
                if (!formData.location) newErrors.location = "Location is required"
                break
            case 2:
                if (!formData.tourDate) newErrors.tourDate = "Tour date is required"
                if (!formData.tourTime) newErrors.tourTime = "Tour time is required"
                break
            case 3:
                if (!formData.firstName) newErrors.firstName = "First name is required"
                if (!formData.lastName) newErrors.lastName = "Last name is required"
                if (!formData.email) newErrors.email = "Email is required"
                break
            case 4:
                if (!formData.budget) newErrors.budget = "Budget is required"
                if (!formData.timeline) newErrors.timeline = "Timeline is required"
                break
        }

        updateErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }, [formData, updateErrors])

    // Step content components
    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <MapPin className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Property Preferences</h3>
                            <p className="text-gray-600">Tell us about your ideal property</p>
                        </div>

                        <div className="space-y-4">
                            <InputField
                                label="Property Type"
                                value={formData.propertyType}
                                onChange={(value) => updateFormData('propertyType', value)}
                                placeholder="e.g., Apartment, House, Villa"
                                error={errors.propertyType}
                                required
                            />

                            <InputField
                                label="Preferred Location"
                                value={formData.location}
                                onChange={(value) => updateFormData('location', value)}
                                placeholder="e.g., Punta del Este, La Barra"
                                error={errors.location}
                                required
                            />
                        </div>
                    </div>
                )

            case 2:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <Calendar className="w-12 h-12 text-green-500 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Schedule Your Tour</h3>
                            <p className="text-gray-600">When would you like to visit?</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <DatePicker
                                    selectedDate={formData.tourDate || undefined}
                                    onDateSelect={(date) => updateFormData('tourDate', date || null)}
                                    selectedTime={formData.tourTime}
                                    onTimeSelect={(time) => updateFormData('tourTime', time)}
                                />
                                {errors.tourDate && (
                                    <p className="text-red-500 text-sm mt-1">{errors.tourDate}</p>
                                )}
                                {errors.tourTime && (
                                    <p className="text-red-500 text-sm mt-1">{errors.tourTime}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Tour Type</label>
                                <select
                                    value={formData.tourType}
                                    onChange={(e) => updateFormData('tourType', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select tour type</option>
                                    <option value="virtual">Virtual Tour</option>
                                    <option value="in-person">In-Person Tour</option>
                                    <option value="both">Both Options</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )

            case 3:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <User className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Contact Information</h3>
                            <p className="text-gray-600">How can we reach you?</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                                label="First Name"
                                value={formData.firstName}
                                onChange={(value) => updateFormData('firstName', value)}
                                error={errors.firstName}
                                required
                            />

                            <InputField
                                label="Last Name"
                                value={formData.lastName}
                                onChange={(value) => updateFormData('lastName', value)}
                                error={errors.lastName}
                                required
                            />

                            <InputField
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={(value) => updateFormData('email', value)}
                                error={errors.email}
                                required
                            />

                            <InputField
                                label="Phone"
                                type="tel"
                                value={formData.phone}
                                onChange={(value) => updateFormData('phone', value)}
                                placeholder="+598 99 123 456"
                            />

                            <InputField
                                label="Nationality"
                                value={formData.nationality}
                                onChange={(value) => updateFormData('nationality', value)}
                                placeholder="e.g., American, Brazilian, Argentine"
                            />
                        </div>
                    </div>
                )

            case 4:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <Settings className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Additional Details</h3>
                            <p className="text-gray-600">Help us personalize your experience</p>
                        </div>

                        <div className="space-y-4">
                            <InputField
                                label="Budget Range"
                                value={formData.budget}
                                onChange={(value) => updateFormData('budget', value)}
                                placeholder="e.g., $200,000 - $500,000"
                                error={errors.budget}
                                required
                            />

                            <InputField
                                label="Timeline"
                                value={formData.timeline}
                                onChange={(value) => updateFormData('timeline', value)}
                                placeholder="e.g., Within 3 months, 6 months, 1 year"
                                error={errors.timeline}
                                required
                            />

                            <div>
                                <label className="block text-sm font-medium mb-2">Special Requests</label>
                                <textarea
                                    value={formData.specialRequests}
                                    onChange={(e) => updateFormData('specialRequests', e.target.value)}
                                    placeholder="Any specific requirements or questions..."
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                                />
                            </div>
                        </div>
                    </div>
                )

            case 5:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Review & Submit</h3>
                            <p className="text-gray-600">Please review your information</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                            <p><strong>Property Type:</strong> {formData.propertyType}</p>
                            <p><strong>Location:</strong> {formData.location}</p>
                            <p><strong>Tour Date:</strong> {formData.tourDate?.toLocaleDateString()}</p>
                            <p><strong>Tour Time:</strong> {formData.tourTime}</p>
                            <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                            <p><strong>Email:</strong> {formData.email}</p>
                            <p><strong>Budget:</strong> {formData.budget}</p>
                            <p><strong>Timeline:</strong> {formData.timeline}</p>
                        </div>

                        {errors.submit && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                {errors.submit}
                            </div>
                        )}
                    </div>
                )

            default:
                return (
                    <div className="text-center space-y-4">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                        <h3 className="text-2xl font-semibold text-green-600">Tour Request Submitted!</h3>
                        <p className="text-gray-600">We&apos;ll contact you within 24 hours to confirm your tour.</p>
                    </div>
                )
        }
    }

    return (
        <div className={className}>
            <GlassCard className="max-w-2xl mx-auto">
                <SectionHeader
                    title="Schedule a Property Tour"
                    subtitle="Let us help you find your perfect property"
                />

                {/* Progress indicator */}
                {currentStep <= totalSteps && (
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">
                                Step {currentStep} of {totalSteps}
                            </span>
                            <span className="text-sm text-gray-500">
                                {Math.round((currentStep / totalSteps) * 100)}% Complete
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Step content */}
                <div className="mb-8">
                    {renderStepContent()}
                </div>

                {/* Navigation buttons */}
                {currentStep <= totalSteps && (
                    <div className="flex justify-between">
                        <Button
                            variant="outline"
                            onClick={currentStep === 1 ? onCancel : prevStep}
                            disabled={isSubmitting}
                        >
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            {currentStep === 1 ? 'Cancel' : 'Previous'}
                        </Button>

                        {currentStep < totalSteps ? (
                            <Button
                                onClick={() => {
                                    if (validateStep(currentStep)) {
                                        nextStep()
                                    }
                                }}
                                disabled={isSubmitting}
                            >
                                Next
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Request'}
                                <Check className="w-4 h-4 ml-2" />
                            </Button>
                        )}
                    </div>
                )}
            </GlassCard>
        </div>
    )
}

// Hook for easier usage with internal state management
export function useTourWizardControlProps(initialProps: Partial<TourWizardControlProps> = {}) {
    const [state, setState] = useState<TourWizardState>(initialState)

    const handleStepChange = useCallback((step: number) => {
        setState(prev => ({ ...prev, currentStep: step }))
    }, [])

    const handleDataChange = useCallback((data: TourWizardData) => {
        setState(prev => ({ ...prev, formData: data }))
    }, [])

    const handleSubmittingChange = useCallback((isSubmitting: boolean) => {
        setState(prev => ({ ...prev, isSubmitting }))
    }, [])

    const handleErrorsChange = useCallback((errors: Record<string, string>) => {
        setState(prev => ({ ...prev, errors }))
    }, [])

    return {
        currentStep: state.currentStep,
        formData: state.formData,
        isSubmitting: state.isSubmitting,
        errors: state.errors,
        onStepChange: handleStepChange,
        onDataChange: handleDataChange,
        onSubmittingChange: handleSubmittingChange,
        onErrorsChange: handleErrorsChange,
        ...initialProps,
    }
}
