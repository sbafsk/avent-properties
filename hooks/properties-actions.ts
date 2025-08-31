/**
 * Properties State Actions
 * 
 * Following Kent C. Dodds' Advanced React Patterns - State Reducer
 * This file defines all possible actions for the properties state management system.
 */

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  city: string;
  neighborhood?: string;
  property_type: string;
  bedrooms?: number;
  bathrooms?: number;
  area_m2?: number;
  amenities?: string[];
  images?: string[];
  status: "AVAILABLE" | "RESERVED" | "SOLD";
  created_at?: string;
  updated_at?: string;
}

export interface FilterState {
  priceRange: [number, number];
  bedrooms: number[];
  bathrooms: number[];
  propertyType: string[];
  location: string[];
  amenities: string[];
  searchQuery?: string;
}

export interface PropertiesState {
  // Data
  properties: Property[];
  filteredProperties: Property[];
  allPropertiesCount: number;
  
  // UI State
  loading: boolean;
  filtering: boolean;
  error: string | null;
  
  // Pagination
  currentPage: number;
  itemsPerPage: number;
  hasMore: boolean;
  
  // Filters
  filters: FilterState;
  
  // Cache
  lastFetchTime: number | null;
  cacheExpiry: number;
}

// Action Types
export type PropertiesAction =
  | { type: 'FETCH_PROPERTIES_START' }
  | { type: 'FETCH_PROPERTIES_SUCCESS'; payload: { properties: Property[]; count: number } }
  | { type: 'FETCH_PROPERTIES_ERROR'; payload: string }
  | { type: 'SET_FILTERS'; payload: FilterState }
  | { type: 'APPLY_FILTERS_START' }
  | { type: 'APPLY_FILTERS_SUCCESS'; payload: Property[] }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_ITEMS_PER_PAGE'; payload: number }
  | { type: 'REFRESH_PROPERTIES' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'RESET_STATE' };

// Action Creators
export const fetchPropertiesStart = (): PropertiesAction => ({
  type: 'FETCH_PROPERTIES_START'
});

export const fetchPropertiesSuccess = (properties: Property[], count: number): PropertiesAction => ({
  type: 'FETCH_PROPERTIES_SUCCESS',
  payload: { properties, count }
});

export const fetchPropertiesError = (error: string): PropertiesAction => ({
  type: 'FETCH_PROPERTIES_ERROR',
  payload: error
});

export const setFilters = (filters: FilterState): PropertiesAction => ({
  type: 'SET_FILTERS',
  payload: filters
});

export const applyFiltersStart = (): PropertiesAction => ({
  type: 'APPLY_FILTERS_START'
});

export const applyFiltersSuccess = (filteredProperties: Property[]): PropertiesAction => ({
  type: 'APPLY_FILTERS_SUCCESS',
  payload: filteredProperties
});

export const clearFilters = (): PropertiesAction => ({
  type: 'CLEAR_FILTERS'
});

export const setPage = (page: number): PropertiesAction => ({
  type: 'SET_PAGE',
  payload: page
});

export const setItemsPerPage = (itemsPerPage: number): PropertiesAction => ({
  type: 'SET_ITEMS_PER_PAGE',
  payload: itemsPerPage
});

export const refreshProperties = (): PropertiesAction => ({
  type: 'REFRESH_PROPERTIES'
});

export const clearError = (): PropertiesAction => ({
  type: 'CLEAR_ERROR'
});

export const resetState = (): PropertiesAction => ({
  type: 'RESET_STATE'
});

// Default state
export const defaultPropertiesState: PropertiesState = {
  properties: [],
  filteredProperties: [],
  allPropertiesCount: 0,
  loading: false,
  filtering: false,
  error: null,
  currentPage: 1,
  itemsPerPage: 20,
  hasMore: true,
  filters: {
    priceRange: [0, 10000000],
    bedrooms: [],
    bathrooms: [],
    propertyType: [],
    location: [],
    amenities: [],
    searchQuery: '',
  },
  lastFetchTime: null,
  cacheExpiry: 5 * 60 * 1000, // 5 minutes
};
