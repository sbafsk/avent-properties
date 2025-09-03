/**
 * useProperties Hook with State Reducer Pattern
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

interface UsePropertiesOptions {
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

interface UsePropertiesReturn {
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
  retryWithBackoff: (attempts?: number, maxAttempts?: number) => Promise<void>;
  clearError: () => void;
  reset: () => void;

  // Computed values
  totalPages: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isCacheValid: boolean;
}

export function useProperties(
  options: UsePropertiesOptions = {}
): UsePropertiesReturn {
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
      console.error('Properties fetch error:', err);

      // Check if it's a fetch/network error
      const isFetchError = err instanceof Error && (
        err.message.includes('fetch failed') ||
        err.message.includes('network') ||
        err.message.includes('timeout')
      );

      const errorMessage = isFetchError
        ? 'Network error: Unable to connect to our services. Please check your internet connection.'
        : err instanceof Error ? err.message : 'Failed to fetch properties';
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

  // Retry with exponential backoff
  const retryWithBackoff = useCallback(async (attempts = 1, maxAttempts = 3) => {
    if (attempts > maxAttempts) {
      dispatch({
        type: 'FETCH_PROPERTIES_ERROR',
        payload: 'Maximum retry attempts reached. Please try again later.',
      });
      return;
    }

    try {
      await fetchProperties();
    } catch (err) {
      // Wait before retrying with exponential backoff
      const delay = Math.min(1000 * Math.pow(2, attempts - 1), 10000);
      setTimeout(() => retryWithBackoff(attempts + 1, maxAttempts), delay);
    }
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
      // Use requestAnimationFrame to defer the execution to the next frame
      // This is more reliable for testing and provides better timing control
      const rafId = requestAnimationFrame(() => {
        fetchProperties();
      });

      return () => cancelAnimationFrame(rafId);
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
    retryWithBackoff,
    clearError,
    reset,
    totalPages,
    canGoNext,
    canGoPrevious,
    isCacheValid,
  };
}

// Re-export types for backward compatibility
export type { Property, PropertiesState, PropertiesAction, FilterState };