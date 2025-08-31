"use client"

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import {
  favoritesReducer,
  initialFavoritesState,
  loadFavoritesStart,
  loadFavoritesSuccess,
  loadFavoritesError,
  loadFavoritesFromStorage,
  saveFavoritesToStorage,
  type FavoritesState,
  type FavoritesAction,
} from './favorites-actions'

// Context
const FavoritesContext = createContext<{
  state: FavoritesState
  dispatch: React.Dispatch<FavoritesAction>
} | undefined>(undefined)

// Provider component
interface FavoritesProviderProps {
  children: ReactNode
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [state, dispatch] = useReducer(favoritesReducer, initialFavoritesState)

  // Load favorites from localStorage on mount
  useEffect(() => {
    const loadFavorites = async () => {
      loadFavoritesStart(dispatch)()
      
      try {
        const favorites = await loadFavoritesFromStorage()
        loadFavoritesSuccess(dispatch)(favorites)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load favorites'
        loadFavoritesError(dispatch)(errorMessage)
      }
    }

    loadFavorites()
  }, [])

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    if (!state.loading && state.error === null) {
      saveFavoritesToStorage(state.favorites)
    }
  }, [state.favorites, state.loading, state.error])

  const value = {
    state,
    dispatch,
  }

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}

// Custom hook to use the context
export function useFavoritesContext() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavoritesContext must be used within a FavoritesProvider')
  }
  return context
}
