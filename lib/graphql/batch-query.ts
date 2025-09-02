/**
 * Batch Query Utility
 * 
 * Optimizes multiple GraphQL operations by batching them together
 * Reduces database round trips and improves performance
 */

import { getSupabaseGraphQLClientServer } from '@/lib/supabase/graphql-client'

export interface BatchQueryOperation {
    id: string
    operation: string
    variables: Record<string, string | number | boolean | null> & { id?: string }
    priority: 'high' | 'medium' | 'low'
}

export interface BatchQueryResult {
    id: string
    data: unknown
    error?: string
}

export interface BatchQueryConfig {
    maxBatchSize: number
    maxWaitTime: number
    priorityOrder: boolean
}

export class BatchQueryManager {
    private static instance: BatchQueryManager
    private pendingOperations: Map<string, BatchQueryOperation> = new Map()
    private batchTimer: NodeJS.Timeout | null = null
    private config: BatchQueryConfig

    private constructor() {
        this.config = {
            maxBatchSize: 10,
            maxWaitTime: 50, // 50ms
            priorityOrder: true,
        }
    }

    static getInstance(): BatchQueryManager {
        if (!BatchQueryManager.instance) {
            BatchQueryManager.instance = new BatchQueryManager()
        }
        return BatchQueryManager.instance
    }

    /**
     * Add an operation to the batch queue
     */
    async addToBatch(operation: Omit<BatchQueryOperation, 'id'>): Promise<BatchQueryResult> {
        const id = Math.random().toString(36).substring(7)
        const fullOperation: BatchQueryOperation = { ...operation, id }

        return new Promise((resolve, reject) => {
            // Store the operation with resolve/reject functions
            this.pendingOperations.set(id, {
                ...fullOperation,
                // @ts-expect-error - Adding custom properties for internal use
                _resolve: resolve,
                _reject: reject,
            })

            // Schedule batch execution
            this.scheduleBatchExecution()
        })
    }

    /**
     * Schedule batch execution
     */
    private scheduleBatchExecution(): void {
        if (this.batchTimer) {
            clearTimeout(this.batchTimer)
        }

        // Execute immediately if batch is full
        if (this.pendingOperations.size >= this.config.maxBatchSize) {
            this.executeBatch()
            return
        }

        // Otherwise, wait for the configured time
        this.batchTimer = setTimeout(() => {
            this.executeBatch()
        }, this.config.maxWaitTime)
    }

    /**
     * Execute the current batch
     */
    private async executeBatch(): Promise<void> {
        if (this.pendingOperations.size === 0) return

        const operations = Array.from(this.pendingOperations.values())

        // Sort by priority if enabled
        if (this.config.priorityOrder) {
            const priorityOrder = { high: 3, medium: 2, low: 1 }
            operations.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
        }

        try {
            // Group operations by type for optimal batching
            const groupedOperations = this.groupOperationsByType(operations)

            // Execute each group
            for (const [type, ops] of groupedOperations) {
                await this.executeOperationGroup(type, ops)
            }
        } catch (error) {
            console.error('Batch execution error:', error)

            // Reject all pending operations
            operations.forEach(op => {
                // @ts-expect-error - Accessing custom properties
                op._reject(error)
            })
        } finally {
            // Clear the batch
            this.pendingOperations.clear()
            this.batchTimer = null
        }
    }

    /**
     * Group operations by type for optimal execution
     */
    private groupOperationsByType(operations: BatchQueryOperation[]): Map<string, BatchQueryOperation[]> {
        const groups = new Map<string, BatchQueryOperation[]>()

        operations.forEach(op => {
            if (!groups.has(op.operation)) {
                groups.set(op.operation, [])
            }
            groups.get(op.operation)!.push(op)
        })

        return groups
    }

    /**
     * Execute a group of operations of the same type
     */
    private async executeOperationGroup(type: string, operations: BatchQueryOperation[]): Promise<void> {
        try {
            const client = await getSupabaseGraphQLClientServer()

            // Build optimized batch query based on operation type
            const batchQuery = this.buildBatchQuery(type, operations)

            if (batchQuery) {
                const result = await client.request(batchQuery.query, batchQuery.variables)

                // Distribute results to individual operations
                this.distributeResults(operations, result)
            } else {
                // Fallback to individual execution
                await this.executeOperationsIndividually(operations)
            }
        } catch (error) {
            console.error(`Batch execution error for ${type}:`, error)

            // Reject all operations in this group
            operations.forEach(op => {
                // @ts-expect-error - Accessing custom properties
                op._reject(error)
            })
        }
    }

    /**
     * Build optimized batch query for multiple operations
     */
    private buildBatchQuery(type: string, operations: BatchQueryOperation[]): { query: string; variables: Record<string, unknown> } | null {
        switch (type) {
            case 'properties':
                return this.buildBatchPropertiesQuery(operations)
            case 'users':
                return this.buildBatchUsersQuery(operations)
            case 'agencies':
                return this.buildBatchAgenciesQuery(operations)
            case 'reservations':
                return this.buildBatchReservationsQuery(operations)
            default:
                return null
        }
    }

    /**
     * Build batch properties query
     */
    private buildBatchPropertiesQuery(operations: BatchQueryOperation[]): { query: string; variables: Record<string, unknown> } | null {
        const ids = operations
            .filter(op => op.variables.id)
            .map(op => op.variables.id)

        if (ids.length === 0) return null

        return {
            query: `
        query GetBatchProperties($ids: [UUID!]!) {
          propertiesCollection(filter: { id: { in: $ids } }) {
            edges {
              node {
                id
                title
                description
                price
                currency
                city
                neighborhood
                property_type
                bedrooms
                bathrooms
                area_m2
                amenities
                images
                status
                agency_id
                created_at
                updated_at
                agency {
                  id
                  name
                  email
                  phone
                  address
                }
              }
            }
          }
        }
      `,
            variables: { ids }
        }
    }

    /**
     * Build batch users query
     */
    private buildBatchUsersQuery(operations: BatchQueryOperation[]): { query: string; variables: Record<string, unknown> } | null {
        const ids = operations
            .filter(op => op.variables.id)
            .map(op => op.variables.id)

        if (ids.length === 0) return null

        return {
            query: `
        query GetBatchUsers($ids: [UUID!]!) {
          usersCollection(filter: { id: { in: $ids } }) {
            edges {
              node {
                id
                email
                name
                role
                created_at
                updated_at
              }
            }
          }
        }
      `,
            variables: { ids }
        }
    }

    /**
     * Build batch agencies query
     */
    private buildBatchAgenciesQuery(operations: BatchQueryOperation[]): { query: string; variables: Record<string, unknown> } | null {
        const ids = operations
            .filter(op => op.variables.id)
            .map(op => op.variables.id)

        if (ids.length === 0) return null

        return {
            query: `
        query GetBatchAgencies($ids: [UUID!]!) {
          agenciesCollection(filter: { id: { in: $ids } }) {
            edges {
              node {
                id
                name
                email
                phone
                address
                created_at
                updated_at
                propertiesCollection {
                  edges {
                    node {
                      id
                      title
                      price
                      city
                      status
                    }
                  }
                }
              }
            }
          }
        }
      `,
            variables: { ids }
        }
    }

    /**
     * Build batch reservations query
     */
    private buildBatchReservationsQuery(operations: BatchQueryOperation[]): { query: string; variables: Record<string, unknown> } | null {
        const ids = operations
            .filter(op => op.variables.id)
            .map(op => op.variables.id)

        if (ids.length === 0) return null

        return {
            query: `
        query GetBatchReservations($ids: [UUID!]!) {
          tour_reservationsCollection(filter: { id: { in: $ids } }) {
            edges {
              node {
                id
                scheduled_date
                deposit_amount
                status
                created_at
                updated_at
                user {
                  id
                  name
                  email
                }
                property {
                  id
                  title
                  city
                  price
                }
              }
            }
          }
        }
      `,
            variables: { ids }
        }
    }

    /**
     * Distribute batch results to individual operations
     */
    private distributeResults(operations: BatchQueryOperation[], result: Record<string, unknown>): void {
        operations.forEach(op => {
            try {
                let data: unknown = null

                // Extract data based on operation type
                switch (op.operation) {
                    case 'properties':
                        data = this.extractPropertyData(result, op.variables.id)
                        break
                    case 'users':
                        data = this.extractUserData(result, op.variables.id)
                        break
                    case 'agencies':
                        data = this.extractAgencyData(result, op.variables.id)
                        break
                    case 'reservations':
                        data = this.extractReservationData(result, op.variables.id)
                        break
                    default:
                        data = result
                }

                // @ts-expect-error - Accessing custom properties
                op._resolve({ id: op.id, data })
            } catch (error) {
                // @ts-expect-error - Accessing custom properties
                op._reject(error)
            }
        })
    }

    /**
     * Extract property data from batch result
     */
    private extractPropertyData(result: Record<string, unknown>, id: string): unknown {
        const collection = result.propertiesCollection as { edges: Array<{ node: Record<string, unknown> }> } | undefined
        const property = collection?.edges?.find(
            (edge) => edge.node.id === id
        )
        return property?.node || null
    }

    /**
     * Extract user data from batch result
     */
    private extractUserData(result: Record<string, unknown>, id: string): unknown {
        const collection = result.usersCollection as { edges: Array<{ node: Record<string, unknown> }> } | undefined
        const user = collection?.edges?.find(
            (edge) => edge.node.id === id
        )
        return user?.node || null
    }

    /**
     * Extract agency data from batch result
     */
    private extractAgencyData(result: Record<string, unknown>, id: string): unknown {
        const collection = result.agenciesCollection as { edges: Array<{ node: Record<string, unknown> }> } | undefined
        const agency = collection?.edges?.find(
            (edge) => edge.node.id === id
        )
        return agency?.node || null
    }

    /**
     * Extract reservation data from batch result
     */
    private extractReservationData(result: Record<string, unknown>, id: string): unknown {
        const collection = result.tour_reservationsCollection as { edges: Array<{ node: Record<string, unknown> }> } | undefined
        const reservation = collection?.edges?.find(
            (edge) => edge.node.id === id
        )
        return reservation?.node || null
    }

    /**
     * Execute operations individually as fallback
     */
    private async executeOperationsIndividually(operations: BatchQueryOperation[]): Promise<void> {
        const client = await getSupabaseGraphQLClientServer()

        for (const op of operations) {
            try {
                // Build individual query
                const query = this.buildIndividualQuery(op.operation, op.variables)

                if (query) {
                    const result = await client.request(query.query, query.variables)
                    const data = this.extractIndividualResult(op.operation, result)

                    // @ts-expect-error - Accessing custom properties
                    op._resolve({ id: op.id, data })
                } else {
                    throw new Error(`Unsupported operation: ${op.operation}`)
                }
            } catch (error) {
                // @ts-expect-error - Accessing custom properties
                op._reject(error)
            }
        }
    }

    /**
     * Build individual query for fallback execution
     */
    private buildIndividualQuery(operation: string, variables: Record<string, unknown>): { query: string; variables: Record<string, unknown> } | null {
        switch (operation) {
            case 'property':
                return {
                    query: `
            query GetProperty($id: UUID!) {
              propertiesCollection(filter: { id: { eq: $id } }) {
                edges {
                  node {
                    id
                    title
                    description
                    price
                    currency
                    city
                    neighborhood
                    property_type
                    bedrooms
                    bathrooms
                    area_m2
                    amenities
                    images
                    status
                    agency_id
                    created_at
                    updated_at
                    agency {
                      id
                      name
                      email
                      phone
                      address
                    }
                  }
                }
              }
            }
          `,
                    variables
                }
            default:
                return null
        }
    }

    /**
     * Extract result from individual query
     */
    private extractIndividualResult(operation: string, result: Record<string, unknown>): unknown {
        switch (operation) {
            case 'property':
                return result.propertiesCollection.edges[0]?.node || null
            default:
                return result
        }
    }

    /**
     * Update configuration
     */
    updateConfig(config: Partial<BatchQueryConfig>): void {
        this.config = { ...this.config, ...config }
    }

    /**
     * Get current batch status
     */
    getBatchStatus(): { pendingCount: number; isExecuting: boolean } {
        return {
            pendingCount: this.pendingOperations.size,
            isExecuting: this.batchTimer !== null,
        }
    }

    /**
     * Clear all pending operations
     */
    clearBatch(): void {
        this.pendingOperations.clear()
        if (this.batchTimer) {
            clearTimeout(this.batchTimer)
            this.batchTimer = null
        }
    }
}

export const batchQueryManager = BatchQueryManager.getInstance()

/**
 * Hook for using batch queries
 */
export function useBatchQuery() {
    return {
        addToBatch: batchQueryManager.addToBatch.bind(batchQueryManager),
        getBatchStatus: batchQueryManager.getBatchStatus.bind(batchQueryManager),
        updateConfig: batchQueryManager.updateConfig.bind(batchQueryManager),
        clearBatch: batchQueryManager.clearBatch.bind(batchQueryManager),
    }
}
