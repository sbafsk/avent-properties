import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

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

export function useProperties(options: UsePropertiesOptions = {}) {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);

    const fetchProperties = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const supabase = createClient();
            let query = supabase
                .from("properties")
                .select("*")
                .eq("status", "AVAILABLE")
                .order("created_at", { ascending: false });

            // Apply filters
            if (options.filters?.city) {
                query = query.eq("city", options.filters.city);
            }
            if (options.filters?.propertyType) {
                query = query.eq("property_type", options.filters.propertyType);
            }
            if (options.filters?.minPrice) {
                query = query.gte("price", options.filters.minPrice);
            }
            if (options.filters?.maxPrice) {
                query = query.lte("price", options.filters.maxPrice);
            }
            if (options.filters?.bedrooms) {
                query = query.gte("bedrooms", options.filters.bedrooms);
            }
            if (options.filters?.status) {
                query = query.eq("status", options.filters.status);
            }

            // Apply limit
            if (options.limit) {
                query = query.limit(options.limit);
            }

            const { data, error } = await query;

            if (error) throw error;

            setProperties(data || []);
            setHasMore((data?.length || 0) === (options.limit || 20));
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to fetch properties"
            );
        } finally {
            setLoading(false);
        }
    }, [options.filters, options.limit]);

    useEffect(() => {
        fetchProperties();
    }, [fetchProperties]);

    const refresh = useCallback(() => {
        fetchProperties();
    }, [fetchProperties]);

    return {
        properties,
        loading,
        error,
        hasMore,
        refresh,
    };
}
