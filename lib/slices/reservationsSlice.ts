import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface TourReservation {
	id: string
	user_id: string
	property_id: string
	scheduled_date: string
	deposit_amount: number
	status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
	created_at: string
	updated_at: string
	property?: {
		id: string
		title: string
		price: number
		currency: string
		city: string
		images: string[] | null
	}
}

interface ReservationsState {
	reservations: TourReservation[]
	selectedReservation: TourReservation | null
	isLoading: boolean
	error: string | null
}

const initialState: ReservationsState = {
	reservations: [],
	selectedReservation: null,
	isLoading: false,
	error: null,
}

const reservationsSlice = createSlice({
	name: 'reservations',
	initialState,
	reducers: {
		setReservations: (state, action: PayloadAction<TourReservation[]>) => {
			state.reservations = action.payload
			state.isLoading = false
			state.error = null
		},
		setSelectedReservation: (state, action: PayloadAction<TourReservation>) => {
			state.selectedReservation = action.payload
		},
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.isLoading = action.payload
		},
		setError: (state, action: PayloadAction<string>) => {
			state.error = action.payload
			state.isLoading = false
		},
		addReservation: (state, action: PayloadAction<TourReservation>) => {
			state.reservations.push(action.payload)
		},
		updateReservation: (state, action: PayloadAction<TourReservation>) => {
			const index = state.reservations.findIndex((r) => r.id === action.payload.id)
			if (index !== -1) {
				state.reservations[index] = action.payload
			}
		},
		removeReservation: (state, action: PayloadAction<string>) => {
			state.reservations = state.reservations.filter((r) => r.id !== action.payload)
		},
		clearError: (state) => {
			state.error = null
		},
	},
})

export const {
	setReservations,
	setSelectedReservation,
	setLoading,
	setError,
	addReservation,
	updateReservation,
	removeReservation,
	clearError,
} = reservationsSlice.actions

export default reservationsSlice.reducer
