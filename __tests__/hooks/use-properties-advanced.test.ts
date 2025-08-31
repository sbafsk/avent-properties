/**
 * Tests for usePropertiesAdvanced Hook with State Reducer Pattern
 */

import { renderHook, act } from '@testing-library/react'
import { usePropertiesAdvanced } from '@/hooks/use-properties-advanced'
import { propertiesReducer } from '@/hooks/properties-reducer'
import { defaultPropertiesState, type PropertiesAction, type Property } from '@/hooks/properties-actions'

// Mock Supabase client with synchronous behavior for testing
const mockSupabaseClient = {
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        order: jest.fn(() => ({
          limit: jest.fn(() => Promise.resolve({
            data: [],
            error: null,
            count: 0
          }))
        }))
      }))
    }))
  }))
}

jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => mockSupabaseClient)
}))

// Mock data
const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Luxury Beach House',
    description: 'Beautiful beachfront property',
    price: 500000,
    currency: 'USD',
    city: 'Punta del Este',
    property_type: 'Villa',
    bedrooms: 4,
    bathrooms: 3,
    area_m2: 200,
    amenities: ['Ocean View', 'Private Pool'],
    images: ['image1.jpg'],
    status: 'AVAILABLE',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: '2',
    title: 'Modern Apartment',
    description: 'Contemporary city apartment',
    price: 300000,
    currency: 'USD',
    city: 'José Ignacio',
    property_type: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    area_m2: 120,
    amenities: ['Gym', 'Concierge'],
    images: ['image2.jpg'],
    status: 'AVAILABLE',
    created_at: '2024-01-02',
    updated_at: '2024-01-02',
  },
]

describe('usePropertiesAdvanced Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => usePropertiesAdvanced({
        autoFetch: false, // Disable auto-fetch to test initial state
      }))

      expect(result.current.state).toEqual({
        ...defaultPropertiesState,
        properties: [],
        filteredProperties: [],
        allPropertiesCount: 0,
      })
    })

    it('should initialize with custom options', () => {
      const { result } = renderHook(() => usePropertiesAdvanced({
        limit: 50,
        cacheExpiry: 10000,
        initialProperties: mockProperties,
      }))

      expect(result.current.state.properties).toEqual(mockProperties)
      expect(result.current.state.filteredProperties).toEqual(mockProperties.slice(0, 20))
      expect(result.current.state.allPropertiesCount).toBe(2)
    })
  })

  describe('Computed Values', () => {
    it('should calculate total pages correctly', () => {
      const { result } = renderHook(() => usePropertiesAdvanced({
        initialProperties: mockProperties,
        autoFetch: false,
      }))

      // With 2 properties and default itemsPerPage of 20, should be 1 page
      expect(result.current.totalPages).toBe(1)
    })

    it('should determine pagination state correctly', () => {
      const { result } = renderHook(() => usePropertiesAdvanced({
        initialProperties: mockProperties,
      }))

      expect(result.current.canGoNext).toBe(false)
      expect(result.current.canGoPrevious).toBe(false)
    })

    it('should check cache validity', () => {
      const { result } = renderHook(() => usePropertiesAdvanced({
        initialProperties: mockProperties,
      }))

      expect(result.current.isCacheValid).toBe(false)
    })
  })

  describe('Actions', () => {
    it('should set filters correctly', () => {
      const { result } = renderHook(() => usePropertiesAdvanced())

      act(() => {
        result.current.setFilters({
          priceRange: [100000, 400000],
          bedrooms: [2],
          bathrooms: [],
          propertyType: ['Apartment'],
          location: ['José Ignacio'],
          amenities: [],
          searchQuery: 'modern',
        })
      })

      expect(result.current.state.filters).toEqual({
        priceRange: [100000, 400000],
        bedrooms: [2],
        bathrooms: [],
        propertyType: ['Apartment'],
        location: ['José Ignacio'],
        amenities: [],
        searchQuery: 'modern',
      })
    })

    it('should clear filters correctly', () => {
      const { result } = renderHook(() => usePropertiesAdvanced({
        initialProperties: mockProperties,
      }))

      // First set some filters
      act(() => {
        result.current.setFilters({
          priceRange: [100000, 400000],
          bedrooms: [2],
          bathrooms: [],
          propertyType: ['Apartment'],
          location: ['José Ignacio'],
          amenities: [],
        })
      })

      // Then clear them
      act(() => {
        result.current.clearFilters()
      })

      expect(result.current.state.filters).toEqual(defaultPropertiesState.filters)
    })

    it('should set page correctly', () => {
      const { result } = renderHook(() => usePropertiesAdvanced({
        initialProperties: mockProperties,
        limit: 1,
      }))

      act(() => {
        result.current.setPage(2)
      })

      expect(result.current.state.currentPage).toBe(2)
    })

    it('should set items per page correctly', () => {
      const { result } = renderHook(() => usePropertiesAdvanced({
        initialProperties: mockProperties,
      }))

      act(() => {
        result.current.setItemsPerPage(10)
      })

      expect(result.current.state.itemsPerPage).toBe(10)
    })

    it('should clear error correctly', () => {
      const { result } = renderHook(() => usePropertiesAdvanced())

      // Manually set an error (this would normally come from a failed fetch)
      act(() => {
        result.current.state.error = 'Test error'
      })

      act(() => {
        result.current.clearError()
      })

      expect(result.current.state.error).toBeNull()
    })

    it('should reset state correctly', () => {
      const { result } = renderHook(() => usePropertiesAdvanced({
        initialProperties: mockProperties,
        autoFetch: false,
      }))

      // Modify state
      act(() => {
        result.current.setPage(3)
        result.current.setItemsPerPage(5)
      })

      // Reset
      act(() => {
        result.current.reset()
      })

      expect(result.current.state).toEqual(defaultPropertiesState)
    })
  })

  describe('Auto-fetch Behavior', () => {
    it('should not auto-fetch when autoFetch is false', () => {
      const { result } = renderHook(() => usePropertiesAdvanced({
        autoFetch: false,
      }))

      // The hook should not attempt to fetch on mount
      expect(result.current.state.loading).toBe(false)
    })

    it('should have fetchProperties function available for manual fetching', async () => {
      const { result } = renderHook(() => usePropertiesAdvanced({
        autoFetch: false,
      }))

      // Should be able to manually fetch
      expect(typeof result.current.fetchProperties).toBe('function')
      
      // Manual fetch should work
      await act(async () => {
        await result.current.fetchProperties()
      })
      
      expect(result.current.state.loading).toBe(false)
    })
  })
})

describe('propertiesReducer', () => {
  describe('FETCH_PROPERTIES_START', () => {
    it('should set loading to true and clear error', () => {
      const state = { ...defaultPropertiesState, error: 'Previous error' }
      const action: PropertiesAction = { type: 'FETCH_PROPERTIES_START' }

      const newState = propertiesReducer(state, action)

      expect(newState.loading).toBe(true)
      expect(newState.error).toBeNull()
    })
  })

  describe('FETCH_PROPERTIES_SUCCESS', () => {
    it('should update properties and apply filters', () => {
      const state = { ...defaultPropertiesState, loading: true }
      const action: PropertiesAction = {
        type: 'FETCH_PROPERTIES_SUCCESS',
        payload: { properties: mockProperties, count: 2 }
      }

      const newState = propertiesReducer(state, action)

      expect(newState.properties).toEqual(mockProperties)
      expect(newState.allPropertiesCount).toBe(2)
      expect(newState.loading).toBe(false)
      expect(newState.error).toBeNull()
      expect(newState.lastFetchTime).toBeGreaterThan(0)
    })
  })

  describe('FETCH_PROPERTIES_ERROR', () => {
    it('should set error and stop loading', () => {
      const state = { ...defaultPropertiesState, loading: true }
      const action: PropertiesAction = {
        type: 'FETCH_PROPERTIES_ERROR',
        payload: 'Network error'
      }

      const newState = propertiesReducer(state, action)

      expect(newState.loading).toBe(false)
      expect(newState.error).toBe('Network error')
    })
  })

  describe('SET_FILTERS', () => {
    it('should update filters and reset page', () => {
      const state = { ...defaultPropertiesState, currentPage: 3 }
      const newFilters = {
        priceRange: [100000, 400000] as [number, number],
        bedrooms: [2],
        bathrooms: [],
        propertyType: ['Apartment'],
        location: ['José Ignacio'],
        amenities: [],
      }
      const action: PropertiesAction = {
        type: 'SET_FILTERS',
        payload: newFilters
      }

      const newState = propertiesReducer(state, action)

      expect(newState.filters).toEqual(newFilters)
      expect(newState.currentPage).toBe(1)
    })
  })

  describe('CLEAR_FILTERS', () => {
    it('should reset filters to default and update filtered properties', () => {
      const state = {
        ...defaultPropertiesState,
        properties: mockProperties,
        filters: {
          priceRange: [100000, 400000] as [number, number],
          bedrooms: [2],
          bathrooms: [],
          propertyType: ['Apartment'],
          location: ['José Ignacio'],
          amenities: [],
        }
      }
      const action: PropertiesAction = { type: 'CLEAR_FILTERS' }

      const newState = propertiesReducer(state, action)

      expect(newState.filters).toEqual(defaultPropertiesState.filters)
      expect(newState.currentPage).toBe(1)
    })
  })

  describe('SET_PAGE', () => {
    it('should update current page and recalculate pagination', () => {
      const state = {
        ...defaultPropertiesState,
        properties: mockProperties,
        itemsPerPage: 1,
      }
      const action: PropertiesAction = {
        type: 'SET_PAGE',
        payload: 2
      }

      const newState = propertiesReducer(state, action)

      expect(newState.currentPage).toBe(2)
      expect(newState.filteredProperties).toHaveLength(1)
    })
  })

  describe('RESET_STATE', () => {
    it('should return default state', () => {
      const state = {
        ...defaultPropertiesState,
        properties: mockProperties,
        currentPage: 5,
        error: 'Some error',
      }
      const action: PropertiesAction = { type: 'RESET_STATE' }

      const newState = propertiesReducer(state, action)

      expect(newState).toEqual(defaultPropertiesState)
    })
  })
})
