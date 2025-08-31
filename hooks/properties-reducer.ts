/**
 * Properties State Reducer
 * 
 * Following Kent C. Dodds' Advanced React Patterns - State Reducer
 * This reducer handles all state transitions for the properties management system.
 */

import { PropertiesState, PropertiesAction, defaultPropertiesState } from './properties-actions';

// Filtering logic
function applyFiltersToProperties(properties: any[], filters: any) {
  return properties.filter((property) => {
    // Price range filter
    if (property.price < filters.priceRange[0] || property.price > filters.priceRange[1]) {
      return false;
    }

    // Search query filter
    if (filters.searchQuery) {
      const searchLower = filters.searchQuery.toLowerCase();
      const matchesSearch = 
        property.title.toLowerCase().includes(searchLower) ||
        property.description.toLowerCase().includes(searchLower) ||
        property.city.toLowerCase().includes(searchLower) ||
        (property.neighborhood && property.neighborhood.toLowerCase().includes(searchLower));
      
      if (!matchesSearch) {
        return false;
      }
    }

    // Location filter
    if (filters.location.length > 0 && !filters.location.includes(property.city)) {
      return false;
    }

    // Property type filter
    if (filters.propertyType.length > 0 && !filters.propertyType.includes(property.property_type)) {
      return false;
    }

    // Bedrooms filter
    if (filters.bedrooms.length > 0 && property.bedrooms && 
        !filters.bedrooms.some((min: number) => (property.bedrooms || 0) >= min)) {
      return false;
    }

    // Bathrooms filter
    if (filters.bathrooms.length > 0 && property.bathrooms && 
        !filters.bathrooms.some((min: number) => (property.bathrooms || 0) >= min)) {
      return false;
    }

    // Amenities filter
    if (filters.amenities.length > 0 && property.amenities) {
      const hasRequiredAmenity = filters.amenities.some((amenity: string) => 
        property.amenities!.includes(amenity)
      );
      if (!hasRequiredAmenity) {
        return false;
      }
    }

    return true;
  });
}

// Pagination logic
function getPaginatedProperties(properties: any[], page: number, itemsPerPage: number) {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return properties.slice(startIndex, endIndex);
}

export function propertiesReducer(state: PropertiesState, action: PropertiesAction): PropertiesState {
  switch (action.type) {
    case 'FETCH_PROPERTIES_START':
      return {
        ...state,
        loading: true,
        error: null,
      };

    case 'FETCH_PROPERTIES_SUCCESS': {
      const { properties, count } = action.payload;
      const filteredProperties = applyFiltersToProperties(properties, state.filters);
      const paginatedProperties = getPaginatedProperties(filteredProperties, state.currentPage, state.itemsPerPage);
      
      return {
        ...state,
        properties,
        filteredProperties: paginatedProperties,
        allPropertiesCount: count,
        loading: false,
        error: null,
        hasMore: paginatedProperties.length === state.itemsPerPage,
        lastFetchTime: Date.now(),
      };
    }

    case 'FETCH_PROPERTIES_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case 'SET_FILTERS':
      return {
        ...state,
        filters: action.payload,
        currentPage: 1, // Reset to first page when filters change
      };

    case 'APPLY_FILTERS_START':
      return {
        ...state,
        filtering: true,
        error: null,
      };

    case 'APPLY_FILTERS_SUCCESS': {
      const paginatedProperties = getPaginatedProperties(action.payload, state.currentPage, state.itemsPerPage);
      
      return {
        ...state,
        filteredProperties: paginatedProperties,
        filtering: false,
        hasMore: paginatedProperties.length === state.itemsPerPage,
      };
    }

    case 'CLEAR_FILTERS':
      return {
        ...state,
        filters: defaultPropertiesState.filters,
        currentPage: 1,
        filteredProperties: getPaginatedProperties(state.properties, 1, state.itemsPerPage),
      };

    case 'SET_PAGE': {
      const filteredProperties = applyFiltersToProperties(state.properties, state.filters);
      const paginatedProperties = getPaginatedProperties(filteredProperties, action.payload, state.itemsPerPage);
      
      return {
        ...state,
        currentPage: action.payload,
        filteredProperties: paginatedProperties,
        hasMore: paginatedProperties.length === state.itemsPerPage,
      };
    }

    case 'SET_ITEMS_PER_PAGE': {
      const filteredProperties = applyFiltersToProperties(state.properties, state.filters);
      const paginatedProperties = getPaginatedProperties(filteredProperties, state.currentPage, action.payload);
      
      return {
        ...state,
        itemsPerPage: action.payload,
        filteredProperties: paginatedProperties,
        hasMore: paginatedProperties.length === action.payload,
      };
    }

    case 'REFRESH_PROPERTIES':
      return {
        ...state,
        lastFetchTime: null, // Force refresh by clearing cache
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    case 'RESET_STATE':
      return defaultPropertiesState;

    default:
      return state;
  }
}

// Custom reducer hook for external customization
export type PropertiesReducer = (state: PropertiesState, action: PropertiesAction) => PropertiesState;

export function usePropertiesReducer(
  customReducer?: PropertiesReducer
): (state: PropertiesState, action: PropertiesAction) => PropertiesState {
  return customReducer || propertiesReducer;
}
