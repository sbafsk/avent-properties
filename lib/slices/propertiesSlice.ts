import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Property {
	id: string
	title: string
	description: string
	price: number
	currency: string
	city: string
	neighborhood: string | null
	property_type: string
	bedrooms: number | null
	bathrooms: number | null
	area_m2: number | null
	amenities: string[] | null
	images: string[] | null
	status: 'available' | 'reserved' | 'sold'
	agency_id: string
	created_at: string
	updated_at: string
}

interface PropertiesState {
	properties: Property[]
	selectedProperty: Property | null
	isLoading: boolean
	error: string | null
	filters: {
		city: string
		property_type: string
		min_price: number
		max_price: number
		bedrooms: number
		status: string
	}
}

const initialState: PropertiesState = {
	properties: [],
	selectedProperty: null,
	isLoading: false,
	error: null,
	filters: {
		city: '',
		property_type: '',
		min_price: 0,
		max_price: 0,
		bedrooms: 0,
		status: '',
	},
}

const propertiesSlice = createSlice({
	name: 'properties',
	initialState,
	reducers: {
		setProperties: (state, action: PayloadAction<Property[]>) => {
			state.properties = action.payload
			state.isLoading = false
			state.error = null
		},
		setSelectedProperty: (state, action: PayloadAction<Property>) => {
			state.selectedProperty = action.payload
		},
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.isLoading = action.payload
		},
		setError: (state, action: PayloadAction<string>) => {
			state.error = action.payload
			state.isLoading = false
		},
		setFilters: (state, action: PayloadAction<Partial<PropertiesState['filters']>>) => {
			state.filters = { ...state.filters, ...action.payload }
		},
		clearFilters: (state) => {
			state.filters = initialState.filters
		},
		addProperty: (state, action: PayloadAction<Property>) => {
			state.properties.push(action.payload)
		},
		updateProperty: (state, action: PayloadAction<Property>) => {
			const index = state.properties.findIndex((p) => p.id === action.payload.id)
			if (index !== -1) {
				state.properties[index] = action.payload
			}
		},
		removeProperty: (state, action: PayloadAction<string>) => {
			state.properties = state.properties.filter((p) => p.id !== action.payload)
		},
	},
})

export const {
	setProperties,
	setSelectedProperty,
	setLoading,
	setError,
	setFilters,
	clearFilters,
	addProperty,
	updateProperty,
	removeProperty,
} = propertiesSlice.actions

export default propertiesSlice.reducer
