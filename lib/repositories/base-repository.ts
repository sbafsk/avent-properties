// Repository Pattern for Data Access
// Based on patterns.md recommendations

export interface Repository<T, K = string> {
  findById(id: K): Promise<T | null>
  findMany(criteria: SearchCriteria): Promise<T[]>
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>
  update(id: K, data: Partial<T>): Promise<T>
  delete(id: K): Promise<void>
}

export interface SearchCriteria {
  limit?: number
  offset?: number
  orderBy?: string
  orderDirection?: 'asc' | 'desc'
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Base repository implementation with common functionality
export abstract class BaseRepository<T, K = string> implements Repository<T, K> {
  protected abstract tableName: string
  protected abstract primaryKey: string

  abstract findById(id: K): Promise<T | null>
  abstract findMany(criteria: SearchCriteria): Promise<T[]>
  abstract create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>
  abstract update(id: K, data: Partial<T>): Promise<T>
  abstract delete(id: K): Promise<void>

  // Common utility methods
  protected validateId(id: K): void {
    if (!id) {
      throw new Error('ID is required')
    }
  }

  protected validateData(data: unknown): void {
    if (!data || typeof data !== 'object') {
      throw new Error('Data must be a valid object')
    }
  }

  protected buildSearchQuery(criteria: SearchCriteria): string {
    let query = `SELECT * FROM ${this.tableName}`

    if (criteria.limit) {
      query += ` LIMIT ${criteria.limit}`
    }

    if (criteria.offset) {
      query += ` OFFSET ${criteria.offset}`
    }

    if (criteria.orderBy) {
      const direction = criteria.orderDirection === 'desc' ? 'DESC' : 'ASC'
      query += ` ORDER BY ${criteria.orderBy} ${direction}`
    }

    return query
  }

  protected handleError(error: unknown, operation: string, context?: Record<string, unknown>): never {
    const errorMessage = `Repository operation '${operation}' failed`
    console.error(errorMessage, { error, context, table: this.tableName })

    if (error instanceof Error) {
      throw new Error(`${errorMessage}: ${error.message}`)
    }

    throw new Error(`${errorMessage}: ${String(error)}`)
  }
}

// In-memory repository for testing and development
export class InMemoryRepository<T extends { id: K }, K = string> extends BaseRepository<T, K> {
  protected tableName = 'in_memory'
  protected primaryKey = 'id'

  private data = new Map<K, T>()
  private nextId = 1

  async findById(id: K): Promise<T | null> {
    this.validateId(id)
    return this.data.get(id) || null
  }

  async findMany(criteria: SearchCriteria): Promise<T[]> {
    const items = Array.from(this.data.values())

    if (criteria.orderBy) {
      items.sort((a, b) => {
        const aValue = (a as Record<string, unknown>)[criteria.orderBy!]
        const bValue = (b as Record<string, unknown>)[criteria.orderBy!]

        if (criteria.orderDirection === 'desc') {
          return (bValue as number) > (aValue as number) ? 1 : -1
        }
        return (aValue as number) > (bValue as number) ? 1 : -1
      })
    }

    if (criteria.offset) {
      items.splice(0, criteria.offset)
    }

    if (criteria.limit) {
      items.splice(criteria.limit)
    }

    return items
  }

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    this.validateData(data)

    const now = new Date()
    const newItem = {
      ...data,
      id: this.nextId++,
      createdAt: now,
      updatedAt: now
    } as unknown as T

    this.data.set(newItem.id as K, newItem)
    return newItem
  }

  async update(id: K, data: Partial<T>): Promise<T> {
    this.validateId(id)
    this.validateData(data)

    const existing = await this.findById(id)
    if (!existing) {
      throw new Error(`Item with ID ${id} not found`)
    }

    const updatedItem = {
      ...existing,
      ...data,
      updatedAt: new Date()
    } as T

    this.data.set(id, updatedItem)
    return updatedItem
  }

  async delete(id: K): Promise<void> {
    this.validateId(id)

    const existing = await this.findById(id)
    if (!existing) {
      throw new Error(`Item with ID ${id} not found`)
    }

    this.data.delete(id)
  }

  // Utility method for testing
  clear(): void {
    this.data.clear()
    this.nextId = 1
  }

  // Utility method for testing
  getCount(): number {
    return this.data.size
  }
}
