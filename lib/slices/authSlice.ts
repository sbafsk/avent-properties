import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
	id: string
	email: string
	name: string
	role: 'admin' | 'client' | 'agency'
}

interface AuthState {
	user: User | null
	isAuthenticated: boolean
	isLoading: boolean
	error: string | null
}

const initialState: AuthState = {
	user: null,
	isAuthenticated: false,
	isLoading: false,
	error: null,
}

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<User>) => {
			state.user = action.payload
			state.isAuthenticated = true
			state.error = null
		},
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.isLoading = action.payload
		},
		setError: (state, action: PayloadAction<string>) => {
			state.error = action.payload
			state.isLoading = false
		},
		logout: (state) => {
			state.user = null
			state.isAuthenticated = false
			state.error = null
		},
		clearError: (state) => {
			state.error = null
		},
	},
})

export const { setUser, setLoading, setError, logout, clearError } = authSlice.actions
export default authSlice.reducer
