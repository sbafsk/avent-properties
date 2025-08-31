/**
 * Context Module Functions for Favorites Management
 * Following Kent C. Dodds' Advanced React Patterns
 * 
 * These functions encapsulate complex state changes and can be tree-shaken
 * and lazily loaded, providing better performance and cleaner APIs.
 */

import { Dispatch } from 'react'

// Types
export interface FavoritesState {
    favorites: string[]
    loading: boolean
    error: string | null
}

export type FavoritesAction =
    | { type: 'LOAD_FAVORITES_START' }
    | { type: 'LOAD_FAVORITES_SUCCESS'; payload: string[] }
    | { type: 'LOAD_FAVORITES_ERROR'; payload: string }
    | { type: 'ADD_FAVORITE'; payload: string }
    | { type: 'REMOVE_FAVORITE'; payload: string }
    | { type: 'TOGGLE_FAVORITE'; payload: string }
    | { type: 'CLEAR_FAVORITES' }
    | { type: 'SET_FAVORITES'; payload: string[] }

// Constants
const FAVORITES_KEY = 'avent-properties-favorites'

// Context Module Functions
// These functions accept dispatch and return action creators
// This pattern enables tree-shaking and lazy loading

export const loadFavoritesStart = (dispatch: Dispatch<FavoritesAction>) => () => {
    dispatch({ type: 'LOAD_FAVORITES_START' })
}

export const loadFavoritesSuccess = (dispatch: Dispatch<FavoritesAction>) => (favorites: string[]) => {
    dispatch({ type: 'LOAD_FAVORITES_SUCCESS', payload: favorites })
}

export const loadFavoritesError = (dispatch: Dispatch<FavoritesAction>) => (error: string) => {
    dispatch({ type: 'LOAD_FAVORITES_ERROR', payload: error })
}

export const addFavorite = (dispatch: Dispatch<FavoritesAction>) => (propertyId: string) => {
    dispatch({ type: 'ADD_FAVORITE', payload: propertyId })
}

export const removeFavorite = (dispatch: Dispatch<FavoritesAction>) => (propertyId: string) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: propertyId })
}

export const toggleFavorite = (dispatch: Dispatch<FavoritesAction>) => (propertyId: string) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: propertyId })
}

export const clearFavorites = (dispatch: Dispatch<FavoritesAction>) => () => {
    dispatch({ type: 'CLEAR_FAVORITES' })
}

export const setFavorites = (dispatch: Dispatch<FavoritesAction>) => (favorites: string[]) => {
    dispatch({ type: 'SET_FAVORITES', payload: favorites })
}

// Utility functions for localStorage operations
export const loadFavoritesFromStorage = async (): Promise<string[]> => {
    try {
        const stored = localStorage.getItem(FAVORITES_KEY)
        if (stored) {
            const favorites = JSON.parse(stored)
            if (Array.isArray(favorites)) {
                return favorites
            }
        }
        return []
    } catch (error) {
        console.error('Failed to load favorites from localStorage:', error)
        return []
    }
}

export const saveFavoritesToStorage = async (favorites: string[]): Promise<void> => {
    try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    } catch (error) {
        console.error('Failed to save favorites to localStorage:', error)
    }
}

// Reducer function
export function favoritesReducer(state: FavoritesState, action: FavoritesAction): FavoritesState {
    switch (action.type) {
        case 'LOAD_FAVORITES_START':
            return { ...state, loading: true, error: null }

        case 'LOAD_FAVORITES_SUCCESS':
            return { ...state, loading: false, favorites: action.payload, error: null }

        case 'LOAD_FAVORITES_ERROR':
            return { ...state, loading: false, error: action.payload }

        case 'ADD_FAVORITE':
            if (state.favorites.includes(action.payload)) {
                return state // Already exists, no change
            }
            return { ...state, favorites: [...state.favorites, action.payload] }

        case 'REMOVE_FAVORITE':
            return { ...state, favorites: state.favorites.filter(id => id !== action.payload) }

        case 'TOGGLE_FAVORITE':
            return {
                ...state,
                favorites: state.favorites.includes(action.payload)
                    ? state.favorites.filter(id => id !== action.payload)
                    : [...state.favorites, action.payload]
            }

        case 'CLEAR_FAVORITES':
            return { ...state, favorites: [] }

        case 'SET_FAVORITES':
            return { ...state, favorites: action.payload }

        default:
            return state
    }
}

// Initial state
export const initialFavoritesState: FavoritesState = {
    favorites: [],
    loading: false,
    error: null,
}
