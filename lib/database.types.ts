export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            agencies: {
                Row: {
                    id: string
                    name: string
                    email: string
                    phone: string | null
                    address: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    email: string
                    phone?: string | null
                    address?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    email?: string
                    phone?: string | null
                    address?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "agencies_id_fkey"
                        columns: ["id"]
                        isOneToOne: true
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            audit_logs: {
                Row: {
                    id: string
                    table_name: string
                    record_id: string
                    action: string
                    old_values: Json | null
                    new_values: Json | null
                    user_id: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    table_name: string
                    record_id: string
                    action: string
                    old_values?: Json | null
                    new_values?: Json | null
                    user_id?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    table_name?: string
                    record_id?: string
                    action?: string
                    old_values?: Json | null
                    new_values?: Json | null
                    user_id?: string | null
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "audit_logs_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            contact_requests: {
                Row: {
                    id: string
                    name: string
                    email: string
                    phone: string | null
                    message: string
                    property_id: string | null
                    status: string
                    user_id: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    email: string
                    phone?: string | null
                    message: string
                    property_id?: string | null
                    status?: string
                    user_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    email?: string
                    phone?: string | null
                    message?: string
                    property_id?: string | null
                    status?: string
                    user_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "contact_requests_property_id_fkey"
                        columns: ["property_id"]
                        isOneToOne: false
                        referencedRelation: "properties"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "contact_requests_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
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
                    bedrooms: number
                    bathrooms: number
                    area_m2: number
                    amenities: string[]
                    images: string[]
                    status: string
                    agency_id: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description: string
                    price: number
                    currency: string
                    city: string
                    neighborhood?: string | null
                    property_type: string
                    bedrooms: number
                    bathrooms: number
                    area_m2: number
                    amenities: string[]
                    images: string[]
                    status: string
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
                    bedrooms?: number
                    bathrooms?: number
                    area_m2?: number
                    amenities?: string[]
                    images?: string[]
                    status?: string
                    agency_id?: string
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "properties_agency_id_fkey"
                        columns: ["agency_id"]
                        isOneToOne: false
                        referencedRelation: "agencies"
                        referencedColumns: ["id"]
                    }
                ]
            }
            tour_reservations: {
                Row: {
                    id: string
                    user_id: string
                    property_id: string
                    scheduled_date: string
                    deposit_amount: number
                    status: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    property_id: string
                    scheduled_date: string
                    deposit_amount: number
                    status?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    property_id?: string
                    scheduled_date?: string
                    deposit_amount?: number
                    status?: string
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "tour_reservations_property_id_fkey"
                        columns: ["property_id"]
                        isOneToOne: false
                        referencedRelation: "properties"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "tour_reservations_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            transactions: {
                Row: {
                    id: string
                    amount: number
                    type: string
                    status: string
                    reservation_id: string | null
                    user_id: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    amount: number
                    type: string
                    status?: string
                    reservation_id?: string | null
                    user_id: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    amount?: number
                    type?: string
                    status?: string
                    reservation_id?: string | null
                    user_id?: string
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "transactions_reservation_id_fkey"
                        columns: ["reservation_id"]
                        isOneToOne: false
                        referencedRelation: "tour_reservations"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "transactions_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            users: {
                Row: {
                    id: string
                    email: string
                    name: string | null
                    role: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    email: string
                    name?: string | null
                    role: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    name?: string | null
                    role?: string
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
