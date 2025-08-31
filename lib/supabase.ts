import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: true,
	},
})

// Database types (will be generated from Supabase)
export interface Database {
	public: {
		Tables: {
			users: {
				Row: {
					id: string
					email: string
					name: string
					role: 'admin' | 'client' | 'agency'
					created_at: string
					updated_at: string
				}
				Insert: {
					id?: string
					email: string
					name: string
					role?: 'admin' | 'client' | 'agency'
					created_at?: string
					updated_at?: string
				}
				Update: {
					id?: string
					email?: string
					name?: string
					role?: 'admin' | 'client' | 'agency'
					created_at?: string
					updated_at?: string
				}
			}
			properties: {
				Row: {
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
					status: 'AVAILABLE' | 'RESERVED' | 'SOLD'
					agency_id: string
					created_at: string
					updated_at: string
				}
				Insert: {
					id?: string
					title: string
					description: string
					price: number
					currency?: string
					city: string
					neighborhood?: string | null
					property_type: string
					bedrooms?: number | null
					bathrooms?: number | null
					area_m2?: number | null
					amenities?: string[] | null
					images?: string[] | null
					status?: 'AVAILABLE' | 'RESERVED' | 'SOLD'
					agency_id: string
					created_at?: string
					updated_at?: string
				}
				Update: {
					id?: string
					title?: string
					description?: string
					price?: number
					currency?: string
					city?: string
					neighborhood?: string | null
					property_type?: string
					bedrooms?: number | null
					bathrooms?: number | null
					area_m2?: number | null
					amenities?: string[] | null
					images?: string[] | null
					status?: 'AVAILABLE' | 'RESERVED' | 'SOLD'
					agency_id?: string
					created_at?: string
					updated_at?: string
				}
			}
			tour_reservations: {
				Row: {
					id: string
					user_id: string
					property_id: string
					scheduled_date: string
					deposit_amount: number
					status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
					created_at: string
					updated_at: string
				}
				Insert: {
					id?: string
					user_id: string
					property_id: string
					scheduled_date: string
					deposit_amount: number
					status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
					created_at?: string
					updated_at?: string
				}
				Update: {
					id?: string
					user_id?: string
					property_id?: string
					scheduled_date?: string
					deposit_amount?: number
					status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
					created_at?: string
					updated_at?: string
				}
			}
		}
	}
}
