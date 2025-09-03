// Validation Builder Pattern for Tour Wizard
// Based on patterns.md recommendations

import { TourWizardData } from '@/components/tour-wizard-control-props'

export interface ValidationRule {
  field: keyof TourWizardData
  validate: (value: unknown) => boolean
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export class TourWizardValidationBuilder {
  private rules: ValidationRule[] = []
  
  requirePropertyType(): this {
    this.rules.push({
      field: 'propertyType',
      validate: (value: unknown) => 
        Array.isArray(value) && value.length > 0,
      message: 'Property type is required'
    })
    return this
  }
  
  requireLocation(): this {
    this.rules.push({
      field: 'location',
      validate: (value: unknown) => 
        Array.isArray(value) && value.length > 0,
      message: 'Location is required'
    })
    return this
  }
  
  requireTourDate(): this {
    this.rules.push({
      field: 'tourDate',
      validate: (value: unknown) => 
        value instanceof Date && !isNaN(value.getTime()),
      message: 'Tour date is required'
    })
    return this
  }
  
  requireTourTime(): this {
    this.rules.push({
      field: 'tourTime',
      validate: (value: unknown) => 
        typeof value === 'string' && value.trim().length > 0,
      message: 'Tour time is required'
    })
    return this
  }
  
  requireTourType(): this {
    this.rules.push({
      field: 'tourType',
      validate: (value: unknown) => 
        typeof value === 'string' && value.trim().length > 0,
      message: 'Tour type is required'
    })
    return this
  }
  
  requireFirstName(): this {
    this.rules.push({
      field: 'firstName',
      validate: (value: unknown) => 
        typeof value === 'string' && value.trim().length > 0,
      message: 'First name is required'
    })
    return this
  }
  
  requireLastName(): this {
    this.rules.push({
      field: 'lastName',
      validate: (value: unknown) => 
        typeof value === 'string' && value.trim().length > 0,
      message: 'Last name is required'
    })
    return this
  }
  
  requireEmail(): this {
    this.rules.push({
      field: 'email',
      validate: (value: unknown) => {
        if (typeof value !== 'string') return false
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(value.trim())
      },
      message: 'Valid email is required'
    })
    return this
  }
  
  requirePhone(): this {
    this.rules.push({
      field: 'phone',
      validate: (value: unknown) => 
        typeof value === 'string' && value.trim().length > 0,
      message: 'Phone number is required'
    })
    return this
  }
  
  requireNationality(): this {
    this.rules.push({
      field: 'nationality',
      validate: (value: unknown) => 
        typeof value === 'string' && value.trim().length > 0,
      message: 'Nationality is required'
    })
    return this
  }
  
  requireBudget(): this {
    this.rules.push({
      field: 'budget',
      validate: (value: unknown) => 
        typeof value === 'string' && value.trim().length > 0,
      message: 'Budget is required'
    })
    return this
  }
  
  requireTimeline(): this {
    this.rules.push({
      field: 'timeline',
      validate: (value: unknown) => 
        typeof value === 'string' && value.trim().length > 0,
      message: 'Timeline is required'
    })
    return this
  }
  
  // Custom validation rules
  requireMinPropertyTypes(minCount: number): this {
    this.rules.push({
      field: 'propertyType',
      validate: (value: unknown) => 
        Array.isArray(value) && value.length >= minCount,
      message: `At least ${minCount} property type(s) must be selected`
    })
    return this
  }
  
  requireMinLocations(minCount: number): this {
    this.rules.push({
      field: 'location',
      validate: (value: unknown) => 
        Array.isArray(value) && value.length >= minCount,
      message: `At least ${minCount} location(s) must be selected`
    })
    return this
  }
  
  requireFutureTourDate(): this {
    this.rules.push({
      field: 'tourDate',
      validate: (value: unknown) => {
        if (!(value instanceof Date)) return false
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return value >= today
      },
      message: 'Tour date must be in the future'
    })
    return this
  }
  
  build(): TourWizardValidator {
    return new TourWizardValidator(this.rules)
  }
}

export class TourWizardValidator {
  constructor(private rules: ValidationRule[]) {}
  
  validate(data: TourWizardData): ValidationResult {
    const errors: Record<string, string> = {}
    
    for (const rule of this.rules) {
      const fieldValue = data[rule.field]
      
      if (!rule.validate(fieldValue)) {
        errors[rule.field] = rule.message
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }
  
  validateStep(step: number, data: TourWizardData): ValidationResult {
    // Get rules for specific step
    const stepRules = this.getStepRules(step)
    const errors: Record<string, string> = {}
    
    for (const rule of stepRules) {
      const fieldValue = data[rule.field]
      
      if (!rule.validate(fieldValue)) {
        errors[rule.field] = rule.message
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }
  
  private getStepRules(step: number): ValidationRule[] {
    switch (step) {
      case 1: // Property Preferences
        return this.rules.filter(rule => 
          rule.field === 'propertyType' || rule.field === 'location'
        )
      case 2: // Schedule Your Tour
        return this.rules.filter(rule => 
          rule.field === 'tourDate' || rule.field === 'tourTime' || rule.field === 'tourType'
        )
      case 3: // Personal Information
        return this.rules.filter(rule => 
          rule.field === 'firstName' || rule.field === 'lastName' || 
          rule.field === 'email' || rule.field === 'phone' || rule.field === 'nationality'
        )
      case 4: // Additional Details
        return this.rules.filter(rule => 
          rule.field === 'budget' || rule.field === 'timeline'
        )
      default:
        return []
    }
  }
}

// Pre-built validators for common use cases
export const createStep1Validator = () => 
  new TourWizardValidationBuilder()
    .requirePropertyType()
    .requireLocation()
    .build()

export const createStep2Validator = () => 
  new TourWizardValidationBuilder()
    .requireTourDate()
    .requireTourTime()
    .requireTourType()
    .requireFutureTourDate()
    .build()

export const createStep3Validator = () => 
  new TourWizardValidationBuilder()
    .requireFirstName()
    .requireLastName()
    .requireEmail()
    .requirePhone()
    .requireNationality()
    .build()

export const createStep4Validator = () => 
  new TourWizardValidationBuilder()
    .requireBudget()
    .requireTimeline()
    .build()

export const createFullValidator = () => 
  new TourWizardValidationBuilder()
    .requirePropertyType()
    .requireLocation()
    .requireTourDate()
    .requireTourTime()
    .requireTourType()
    .requireFirstName()
    .requireLastName()
    .requireEmail()
    .requirePhone()
    .requireNationality()
    .requireBudget()
    .requireTimeline()
    .requireFutureTourDate()
    .build()
