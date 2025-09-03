// Custom Error Hierarchy following SOLID principles
// Based on patterns.md recommendations

export abstract class AventError extends Error {
    abstract readonly code: string
    abstract readonly statusCode: number

    constructor(message: string, public readonly context?: Record<string, unknown>) {
        super(message)
        this.name = this.constructor.name

        // Ensure proper inheritance in ES5 environments
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

// Property-related errors
export class PropertyNotFoundError extends AventError {
    readonly code = 'PROPERTY_NOT_FOUND'
    readonly statusCode = 404

    constructor(propertyId: string) {
        super(`Property with ID ${propertyId} not found`, { propertyId })
    }
}

export class PropertyValidationError extends AventError {
    readonly code = 'PROPERTY_VALIDATION_FAILED'
    readonly statusCode = 400

    constructor(message: string, public readonly fieldErrors: Record<string, string>) {
        super(message, { fieldErrors })
    }
}

// Tour Wizard errors
export class TourWizardValidationError extends AventError {
    readonly code = 'TOUR_WIZARD_VALIDATION_FAILED'
    readonly statusCode = 400

    constructor(message: string, public readonly fieldErrors: Record<string, string>) {
        super(message, { fieldErrors })
    }
}

export class TourSubmissionError extends AventError {
    readonly code = 'TOUR_SUBMISSION_FAILED'
    readonly statusCode = 500

    constructor(message: string, public readonly tourData?: unknown) {
        super(message, { tourData })
    }
}

// Authentication & Authorization errors
export class InsufficientPermissionsError extends AventError {
    readonly code = 'INSUFFICIENT_PERMISSIONS'
    readonly statusCode = 403

    constructor(requiredRole: string, userRole: string) {
        super(`Action requires ${requiredRole} role, user has ${userRole}`, {
            requiredRole,
            userRole
        })
    }
}

export class AuthenticationError extends AventError {
    readonly code = 'AUTHENTICATION_FAILED'
    readonly statusCode = 401

    constructor(message: string, public readonly authContext?: unknown) {
        super(message, { authContext })
    }
}

// Database errors
export class DatabaseError extends AventError {
    readonly code = 'DATABASE_ERROR'
    readonly statusCode = 500

    constructor(message: string, public readonly dbContext?: unknown) {
        super(message, { dbContext })
    }
}

// API errors
export class APIError extends AventError {
    readonly code = 'API_ERROR'
    readonly statusCode = 500

    constructor(message: string, public readonly apiContext?: unknown) {
        super(message, { apiContext })
    }
}

// Utility function to check if an error is an AventError
export function isAventError(error: unknown): error is AventError {
    return error instanceof AventError
}

// Utility function to get error details for logging
export function getErrorDetails(error: unknown): {
    name: string
    message: string
    code?: string
    statusCode?: number
    context?: Record<string, unknown>
    stack?: string
} {
    if (isAventError(error)) {
        return {
            name: error.name,
            message: error.message,
            code: error.code,
            statusCode: error.statusCode,
            context: error.context,
            stack: error.stack
        }
    }

    if (error instanceof Error) {
        return {
            name: error.name,
            message: error.message,
            stack: error.stack
        }
    }

    return {
        name: 'UnknownError',
        message: String(error)
    }
}
