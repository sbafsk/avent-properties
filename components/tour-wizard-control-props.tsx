"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "./glass-card"
import { SectionHeader } from "./section-header"
import { InputField, EmailInput, PhoneInput } from "./input-field"
import { DatePicker } from "./date-picker"
import { MultiSelect } from "./ui/multi-select"
import { PROPERTY_TYPE_OPTIONS, LOCATION_OPTIONS, TOUR_TYPE_OPTIONS } from "./tour-wizard-constants"
import { ChevronLeft, ChevronRight, Check, MapPin, Calendar, User, Settings, CheckCircle } from "lucide-react"
import { createStep1Validator, createStep2Validator, createStep3Validator, createStep4Validator } from "@/lib/validation/tour-wizard-validator"
import { TourWizardValidationError } from "@/lib/errors"

// Types
export interface TourWizardData {
    propertyType: string[]
    location: string[]
    tourDate: Date | null
    tourTime: string
    tourType: string
    firstName: string
    lastName: string
    phone: string
    email: string
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
    propertyType: [],
    location: [],
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
    const updateFormData = useCallback((field: keyof TourWizardData, value: string | string[] | Date | null) => {
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

    // Validation using the new validation system
    const validateStep = useCallback((step: number): boolean => {
        let validator: ReturnType<typeof createStep1Validator> | ReturnType<typeof createStep2Validator> | ReturnType<typeof createStep3Validator> | ReturnType<typeof createStep4Validator>

        switch (step) {
            case 1:
                validator = createStep1Validator()
                break
            case 2:
                validator = createStep2Validator()
                break
            case 3:
                validator = createStep3Validator()
                break
            case 4:
                validator = createStep4Validator()
                break
            default:
                return true
        }

        try {
            const validationResult = validator.validateStep(step, formData)

            updateErrors(validationResult.errors)
            return validationResult.isValid
        } catch (error) {
            if (error instanceof TourWizardValidationError) {
                const newErrors = { submit: error.message }
                updateErrors(newErrors)
            }
            return false
        }
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
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Property Type <span className="text-red-500">*</span>
                                </label>
                                <MultiSelect
                                    options={PROPERTY_TYPE_OPTIONS}
                                    selected={formData.propertyType}
                                    onChange={(selected) => updateFormData('propertyType', selected)}
                                    placeholder="Select property types..."
                                    searchPlaceholder="Search property types..."
                                    emptyText="No property types found."
                                />
                                {errors.propertyType && (
                                    <p className="text-red-500 text-sm mt-1">{errors.propertyType}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Preferred Location <span className="text-red-500">*</span>
                                </label>
                                <MultiSelect
                                    options={LOCATION_OPTIONS}
                                    selected={formData.location}
                                    onChange={(selected) => updateFormData('location', selected)}
                                    placeholder="Select locations..."
                                    searchPlaceholder="Search locations..."
                                    emptyText="No locations found."
                                />
                                {errors.location && (
                                    <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                                )}
                            </div>
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
                                    {TOUR_TYPE_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
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

                            <EmailInput
                                label="Email"
                                value={formData.email}
                                onChange={(value) => updateFormData('email', value)}
                                error={errors.email}
                                required
                            />

                            <PhoneInput
                                label="Phone"
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

                        <div className="glass border border-white/20 p-6 rounded-lg space-y-3">
                            <p className="text-foreground"><strong className="text-gold">Property Type:</strong> {formData.propertyType.length > 0 ? formData.propertyType.map(value => {
                                const option = PROPERTY_TYPE_OPTIONS.find(opt => opt.value === value);
                                return option?.label || value;
                            }).join(', ') : 'Not specified'}</p>
                            <p className="text-foreground"><strong className="text-gold">Location:</strong> {formData.location.length > 0 ? formData.location.map(value => {
                                const option = LOCATION_OPTIONS.find(opt => opt.value === value);
                                return option?.label || value;
                            }).join(', ') : 'Not specified'}</p>
                            <p className="text-foreground"><strong className="text-gold">Tour Date:</strong> {formData.tourDate?.toLocaleDateString()}</p>
                            <p className="text-foreground"><strong className="text-gold">Tour Time:</strong> {formData.tourTime}</p>
                            <p className="text-foreground"><strong className="text-gold">Tour Type:</strong> {formData.tourType ? TOUR_TYPE_OPTIONS.find(opt => opt.value === formData.tourType)?.label || formData.tourType : 'Not specified'}</p>
                            <p className="text-foreground"><strong className="text-gold">Name:</strong> {formData.firstName} {formData.lastName}</p>
                            <p className="text-foreground"><strong className="text-gold">Email:</strong> {formData.email}</p>
                            <p className="text-foreground"><strong className="text-gold">Budget:</strong> {formData.budget}</p>
                            <p className="text-foreground"><strong className="text-gold">Timeline:</strong> {formData.timeline}</p>
                        </div>

                        {errors.submit && (
                            <div className="glass border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
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
                            <span className="text-sm font-medium text-foreground">
                                Step {currentStep} of {totalSteps}
                            </span>
                            <span className="text-sm text-muted-foreground">
                                {Math.round((currentStep / totalSteps) * 100)}% Complete
                            </span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                            <div
                                className="bg-gold h-2 rounded-full transition-all duration-300"
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
