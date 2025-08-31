import { usePropertiesAdvanced } from "./use-properties-advanced";
import type { Property } from "./properties-actions";

interface UsePropertiesOptions {
    filters?: {
        city?: string;
        propertyType?: string;
        minPrice?: number;
        maxPrice?: number;
        bedrooms?: number;
        status?: "AVAILABLE" | "RESERVED" | "SOLD";
    };
    limit?: number;
}

/**
 * useProperties Hook - Now using State Reducer Pattern
 *
 * This hook maintains backward compatibility while internally using
 * the new state reducer pattern for better state management.
 *
 * @deprecated Consider using usePropertiesAdvanced directly for more features
 */
export function useProperties(options: UsePropertiesOptions = {}) {
    const { state, refresh } = usePropertiesAdvanced({
        limit: options.limit,
        autoFetch: true,
    });

    return {
        properties: state.properties,
        loading: state.loading,
        error: state.error,
        hasMore: state.hasMore,
        refresh,
    };
}

// Re-export types for backward compatibility
export type { Property };
