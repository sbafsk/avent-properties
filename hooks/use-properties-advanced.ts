/**
 * Advanced useProperties Hook with State Reducer Pattern
 * 
 * Following Kent C. Dodds' Advanced React Patterns - State Reducer
 * This hook provides complex state management for properties with filtering,
 * pagination, and caching capabilities.
 */

import { useReducer, useCallback, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  PropertiesState, 
  PropertiesAction, 
  defaultPropertiesState,
  Property,
  FilterState 
} from './properties-actions';
import { propertiesReducer, usePropertiesReducer } from './properties-reducer';

interface UsePropertiesAdvancedOptions {
  // Data fetching options
  limit?: number;
  autoFetch?: boolean;
  
  // Caching options
  cacheExpiry?: number;
  
  // Custom reducer for external state control
  customReducer?: (state: PropertiesState, action: PropertiesAction) => PropertiesState;
  
  // Initial data
  initialProperties?: Property[];
  initialFilters?: Partial<FilterState>;
}

interface UsePropertiesAdvancedReturn {
  // State
  state: PropertiesState;
  
  // Actions
  fetchProperties: () => Promise<void>;
  setFilters: (filters: FilterState) => void;
  applyFilters: () => void;
  clearFilters: () => void;
  setPage: (page: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  refresh: () => void;
  clearError: () => void;
  reset: () => void;
  
  // Computed values
  totalPages: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isCacheValid: boolean;
}

export function usePropertiesAdvanced(
  options: UsePropertiesAdvancedOptions = {}
): UsePropertiesAdvancedReturn {
  const {
    limit = 100,
    autoFetch = true,
    cacheExpiry = 5 * 60 * 1000, // 5 minutes
    customReducer,
    initialProperties = [],
    initialFilters = {},
  } = options;

  // Initialize state with custom options
  const initialState: PropertiesState = useMemo(() => ({
    ...defaultPropertiesState,
    properties: initialProperties,
    filteredProperties: initialProperties.slice(0, defaultPropertiesState.itemsPerPage),
    allPropertiesCount: initialProperties.length,
    cacheExpiry,
    filters: {
      ...defaultPropertiesState.filters,
      ...initialFilters,
    },
  }), [initialProperties, initialFilters, cacheExpiry]);

  // Use custom reducer if provided, otherwise use default
  const reducer = usePropertiesReducer(customReducer);
  const [state, dispatch] = useReducer(reducer, initialState);

  // Check if cache is valid
  const isCacheValid = useMemo(() => {
    if (!state.lastFetchTime) return false;
    return Date.now() - state.lastFetchTime < state.cacheExpiry;
  }, [state.lastFetchTime, state.cacheExpiry]);

  // Fetch properties from Supabase
  const fetchProperties = useCallback(async () => {
    // Skip fetch if cache is valid and we have data
    if (isCacheValid && state.properties.length > 0) {
      return;
    }

    dispatch({ type: 'FETCH_PROPERTIES_START' });

    try {
      const supabase = createClient();
      
      // Build query
      let query = supabase
        .from('properties')
        .select('*', { count: 'exact' })
        .eq('status', 'AVAILABLE')
        .order('created_at', { ascending: false });

      // Apply limit
      if (limit) {
        query = query.limit(limit);
      }

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      dispatch({
        type: 'FETCH_PROPERTIES_SUCCESS',
        payload: {
          properties: data || [],
          count: count || 0,
        },
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch properties';
      dispatch({
        type: 'FETCH_PROPERTIES_ERROR',
        payload: errorMessage,
      });
    }
  }, [isCacheValid, state.properties.length, limit]);

  // Apply filters to current properties
  const applyFilters = useCallback(() => {
    dispatch({ type: 'APPLY_FILTERS_START' });

    // Simulate filtering delay for better UX
    setTimeout(() => {
      // The actual filtering is handled by the reducer
      // This is just for the loading state
      dispatch({
        type: 'APPLY_FILTERS_SUCCESS',
        payload: [], // Will be calculated by reducer
      });
    }, 300);
  }, []);

  // Set filters and trigger re-filtering
  const setFilters = useCallback((filters: FilterState) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
    // Auto-apply filters after a short delay
    setTimeout(() => {
      applyFilters();
    }, 100);
  }, [applyFilters]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    dispatch({ type: 'CLEAR_FILTERS' });
  }, []);

  // Set current page
  const setPage = useCallback((page: number) => {
    dispatch({ type: 'SET_PAGE', payload: page });
  }, []);

  // Set items per page
  const setItemsPerPage = useCallback((itemsPerPage: number) => {
    dispatch({ type: 'SET_ITEMS_PER_PAGE', payload: itemsPerPage });
  }, []);

  // Refresh properties (clear cache and fetch)
  const refresh = useCallback(() => {
    dispatch({ type: 'REFRESH_PROPERTIES' });
    fetchProperties();
  }, [fetchProperties]);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // Reset to initial state
  const reset = useCallback(() => {
    dispatch({ type: 'RESET_STATE' });
  }, []);

  // Computed values
  const totalPages = Math.ceil(state.properties.length / state.itemsPerPage);
  const canGoNext = state.currentPage < totalPages;
  const canGoPrevious = state.currentPage > 1;

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch && !isCacheValid) {
      fetchProperties();
    }
  }, [autoFetch, isCacheValid, fetchProperties]);

  return {
    state,
    fetchProperties,
    setFilters,
    applyFilters,
    clearFilters,
    setPage,
    setItemsPerPage,
    refresh,
    clearError,
    reset,
    totalPages,
    canGoNext,
    canGoPrevious,
    isCacheValid,
  };
}
