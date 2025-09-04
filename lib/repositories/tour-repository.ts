// Tour Repository Implementation
// Extends the base repository pattern for tour wizard submissions

import { TourWizardData } from '@/components/tour-wizard-control-props'
import { BaseRepository, SearchCriteria } from './base-repository'
import { TourWizardValidationError } from '@/lib/errors'
import { createFullValidator } from '@/lib/validation/tour-wizard-validator'

// Extended interface for reservation form data
export interface ExtendedTourData extends TourWizardData {
  // Additional fields from reservation form
  guests?: number
  propertyId?: string
  tourPackage?: "basic" | "premium" | "luxury"
  paymentDetails?: {
    cardNumber: string
    expiryDate: string
    cvv: string
    billingAddress: string
  }
}

export interface TourSubmission extends ExtendedTourData {
  id: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  submittedAt: Date
  createdAt: Date
  updatedAt: Date
  notes?: string
  assignedAgent?: string
}

export interface TourSearchCriteria extends SearchCriteria {
  status?: TourSubmission['status']
  location?: string[]
  propertyType?: string[]
  submittedAfter?: Date
  submittedBefore?: Date
}

export class TourRepository extends BaseRepository<TourSubmission, string> {
  protected tableName = 'tour_submissions'
  protected primaryKey = 'id'

  private validator = createFullValidator()

  async create(data: Omit<TourSubmission, 'id' | 'status' | 'submittedAt' | 'createdAt' | 'updatedAt'>): Promise<TourSubmission> {
    try {
      // Validate the tour data before creation
      const validationResult = this.validator.validate(data)
      if (!validationResult.isValid) {
        throw new TourWizardValidationError(
          'Tour submission validation failed',
          validationResult.errors
        )
      }

      const now = new Date()
      const newSubmission: TourSubmission = {
        ...data,
        id: this.generateId(),
        status: 'pending',
        submittedAt: now,
        createdAt: now,
        updatedAt: now
      }

      // In a real implementation, this would save to a database
      // For now, we'll simulate the save operation
      await this.simulateDatabaseSave(newSubmission)

      return newSubmission
    } catch (error) {
      if (error instanceof TourWizardValidationError) {
        throw error
      }

      this.handleError(error, 'create', { data })
    }
  }

  async update(id: string, data: Partial<TourSubmission>): Promise<TourSubmission> {
    try {
      this.validateId(id)

      const existing = await this.findById(id)
      if (!existing) {
        throw new Error(`Tour submission with ID ${id} not found`)
      }

      // Validate any updated fields if they're part of the tour data
      if (this.hasTourDataFields(data)) {
        const validationData = { ...existing, ...data }
        const validationResult = this.validator.validate(validationData)
        if (!validationResult.isValid) {
          throw new TourWizardValidationError(
            'Tour submission validation failed',
            validationResult.errors
          )
        }
      }

      const updatedSubmission: TourSubmission = {
        ...existing,
        ...data,
        updatedAt: new Date()
      }

      // In a real implementation, this would update the database
      await this.simulateDatabaseUpdate(id)

      return updatedSubmission
    } catch (error) {
      if (error instanceof TourWizardValidationError) {
        throw error
      }

      this.handleError(error, 'update', { id, data })
    }
  }

  async findById(id: string): Promise<TourSubmission | null> {
    try {
      this.validateId(id)
      return await this.simulateDatabaseFindById(id)
    } catch (error) {
      this.handleError(error, 'findById', { id })
    }
  }

  async findMany(criteria: TourSearchCriteria = {}): Promise<TourSubmission[]> {
    try {
      return await this.simulateDatabaseFindMany(criteria)
    } catch (error) {
      this.handleError(error, 'findMany', { criteria })
    }
  }

  async delete(id: string): Promise<void> {
    try {
      this.validateId(id)

      const existing = await this.findById(id)
      if (!existing) {
        throw new Error(`Tour submission with ID ${id} not found`)
      }

      // In a real implementation, this would delete from the database
      await this.simulateDatabaseDelete(id)
    } catch (error) {
      this.handleError(error, 'delete', { id })
    }
  }

  // Specialized methods for tour submissions
  async findByStatus(status: TourSubmission['status']): Promise<TourSubmission[]> {
    return this.findMany({ status })
  }

  async findByLocation(locations: string[]): Promise<TourSubmission[]> {
    return this.findMany({ location: locations })
  }

  async findByPropertyType(propertyTypes: string[]): Promise<TourSubmission[]> {
    return this.findMany({ propertyType: propertyTypes })
  }

  async updateStatus(id: string, status: TourSubmission['status'], notes?: string): Promise<TourSubmission> {
    return this.update(id, { status, notes })
  }

  async assignAgent(id: string, agentId: string): Promise<TourSubmission> {
    return this.update(id, { assignedAgent: agentId })
  }

  // Validation helper methods
  private hasTourDataFields(data: Partial<TourSubmission>): boolean {
    const tourDataFields: (keyof TourWizardData)[] = [
      'propertyType', 'location', 'tourDate', 'tourTime', 'tourType',
      'firstName', 'lastName', 'email', 'phone', 'nationality',
      'budget', 'timeline', 'specialRequests'
    ]

    return tourDataFields.some(field => field in data)
  }

  // Utility methods
  private generateId(): string {
    return `tour_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Simulation methods for development/testing
  private async simulateDatabaseSave(submission: TourSubmission): Promise<void> {
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 50))

    // In a real implementation, this would save to Supabase/PostgreSQL
    console.log('Simulating database save:', submission.id)

    // Store in memory for testing (in real app, this would be database)
    if (!this.inMemoryStorage) {
      this.inMemoryStorage = new Map()
    }
    this.inMemoryStorage.set(submission.id, submission)
  }

  private async simulateDatabaseUpdate(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 50))
    console.log('Simulating database update:', id)
  }

  private async simulateDatabaseFindById(id: string): Promise<TourSubmission | null> {
    await new Promise(resolve => setTimeout(resolve, 30))

    // Check in-memory storage first
    if (this.inMemoryStorage && this.inMemoryStorage.has(id)) {
      return this.inMemoryStorage.get(id) || null
    }

    // Simulate finding a submission (in real app, this would query the database)
    console.log('Simulating database findById:', id)
    return null
  }

  private async simulateDatabaseFindMany(criteria: TourSearchCriteria): Promise<TourSubmission[]> {
    await new Promise(resolve => setTimeout(resolve, 50))

    // Check in-memory storage for testing
    if (this.inMemoryStorage) {
      const submissions = Array.from(this.inMemoryStorage.values())

      // Apply basic filtering
      let filtered = submissions

      if (criteria.status) {
        filtered = filtered.filter(s => s.status === criteria.status)
      }

      if (criteria.location && criteria.location.length > 0) {
        filtered = filtered.filter(s =>
          s.location.some(loc => criteria.location!.includes(loc))
        )
      }

      if (criteria.propertyType && criteria.propertyType.length > 0) {
        filtered = filtered.filter(s =>
          s.propertyType.some(type => criteria.propertyType!.includes(type))
        )
      }

      return filtered
    }

    // Simulate finding multiple submissions
    // In a real implementation, this would execute a database query
    console.log('Simulating database findMany with criteria:', criteria)

    return []
  }

  private async simulateDatabaseDelete(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 30))
    console.log('Simulating database delete:', id)

    // Remove from in-memory storage
    if (this.inMemoryStorage) {
      this.inMemoryStorage.delete(id)
    }
  }

  // In-memory storage for testing purposes
  private inMemoryStorage?: Map<string, TourSubmission>
}

// Export a singleton instance for use throughout the application
export const tourRepository = new TourRepository()
