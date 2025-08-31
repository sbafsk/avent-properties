/**
 * Favorites Hook using Context Module Functions Pattern
 * 
 * This hook demonstrates the Context Module Functions pattern from Kent C. Dodds'
 * Advanced React Patterns. It provides a clean API while leveraging the
 * performance benefits of module-level functions.
 */

import { useCallback } from 'react'
import { useFavoritesContext } from './favorites-context'
import {
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearFavorites,
    setFavorites,
} from './favorites-actions'

export function useFavorites() {
    const { state, dispatch } = useFavoritesContext()

    // Create action creators using the context module functions
    const addFavoriteAction = useCallback(addFavorite(dispatch), [dispatch])
    const removeFavoriteAction = useCallback(removeFavorite(dispatch), [dispatch])
    const toggleFavoriteAction = useCallback(toggleFavorite(dispatch), [dispatch])
    const clearFavoritesAction = useCallback(clearFavorites(dispatch), [dispatch])
    const setFavoritesAction = useCallback(setFavorites(dispatch), [dispatch])

    // Helper function to check if a property is favorited
    const isFavorite = useCallback(
        (propertyId: string) => {
            return state.favorites.includes(propertyId)
        },
        [state.favorites]
    )

    // Helper function to get favorites count
    const favoritesCount = state.favorites.length

    return {
        // State
        favorites: state.favorites,
        loading: state.loading,
        error: state.error,
        favoritesCount,

        // Actions
        addFavorite: addFavoriteAction,
        removeFavorite: removeFavoriteAction,
        toggleFavorite: toggleFavoriteAction,
        clearFavorites: clearFavoritesAction,
        setFavorites: setFavoritesAction,

        // Helper functions
        isFavorite,
    }
}