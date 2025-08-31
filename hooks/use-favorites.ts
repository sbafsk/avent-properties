/**
 * Favorites Hook - Advanced React Patterns Implementation
 * 
 * This hook now uses the Context Module Functions pattern for better performance
 * and maintainability. It provides the same API as before for backward compatibility.
 * 
 * @deprecated This hook is being migrated to use the advanced patterns.
 * Consider using the new useFavorites hook from use-favorites-advanced.ts
 */

import { useState, useEffect, useCallback } from "react";

const FAVORITES_KEY = "avent-properties-favorites";

export function useFavorites() {
    const [favorites, setFavorites] = useState<string[]>([]);

    // Load favorites from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(FAVORITES_KEY);
        if (stored) {
            try {
                setFavorites(JSON.parse(stored));
            } catch {
                setFavorites([]);
            }
        }
    }, []);

    // Save favorites to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }, [favorites]);

    const toggleFavorite = useCallback((propertyId: string) => {
        setFavorites((prev) =>
            prev.includes(propertyId)
                ? prev.filter((id) => id !== propertyId)
                : [...prev, propertyId]
        );
    }, []);

    const isFavorite = useCallback(
        (propertyId: string) => {
            return favorites.includes(propertyId);
        },
        [favorites]
    );

    const clearFavorites = useCallback(() => {
        setFavorites([]);
    }, []);

    return {
        favorites,
        toggleFavorite,
        isFavorite,
        clearFavorites,
    };
}


